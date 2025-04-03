import { Flex, HoverCard, Image, Space, Text, Title } from "@mantine/core";
import { useMemo } from "react";
import type { Outputs } from "../../../utils/trcp.ts";
import styles from "./LeagueItemGrid.module.css";

interface Props {
	participant: Outputs["lol"]["getMatchesParticipant"]["data"][number]["info"]["participants"];
	items: Outputs["lol"]["getItems"];
}

interface PreparedItem {
	name: string;
	iconPath: string;
	stats: { name: string; value: string }[];
	abilities: { name: string; description: string }[];
}

export function LeagueItemGrid({ participant, items }: Props) {
	const itemsFiltered = useMemo(() => {
		return [
			participant.item0,
			participant.item1,
			participant.item2,
			participant.item3,
			participant.item4,
			participant.item5,
			participant.item6,
		]
			.map((itemId) => items.find((item) => item.id === itemId))
			.map((item) => {
				const defaultItem: PreparedItem = {
					name: item?.name || "",
					iconPath: item?.iconPath || "",
					stats: [],
					abilities: [],
				};

				if (!item) {
					return defaultItem;
				}

				// If main text available, parse it, else return empty string
				const parser = new DOMParser();
				const doc = parser.parseFromString(item.description, "text/html");
				const mainText = doc.querySelector("mainText");
				if (!mainText) {
					return defaultItem;
				}

				// If stats element available, parse it, else return empty string
				const statsElement = mainText.querySelector("stats");
				if (!statsElement) {
					return defaultItem;
				}

				// Add stats to description
				const statLines = statsElement.innerHTML.split("<br>").filter(Boolean);
				for (const line of statLines) {
					const value = line
						.match(/<attention>(.*?)<\/attention>/)?.[1]
						?.trim();
					const name = line
						.replace(/<attention>.*?<\/attention>/, "")
						.replace(":", "")
						.trim();

					if (!name || !value) {
						continue;
					}

					defaultItem.stats.push({ name, value });
				}

				// Add active/passive to description
				const abilities = mainText.querySelectorAll("active, passive");
				for (const ability of abilities) {
					const abilityName = ability.textContent?.replace(":", "").trim();
					if (!abilityName) {
						continue;
					}

					const abilityTexts = [];
					let currentNode = ability.nextSibling;
					while (currentNode) {
						if (
							currentNode.nodeName.toLowerCase() === "passive" ||
							currentNode.nodeName.toLowerCase() === "active"
						) {
							break;
						}

						if (currentNode.textContent?.trim()) {
							abilityTexts.push(currentNode.textContent.trim());
						}
						currentNode = currentNode.nextSibling;
					}

					defaultItem.abilities.push({
						name: abilityName,
						description: abilityTexts.join(" "),
					});
				}

				return defaultItem;
			});
	}, [participant, items]);

	return (
		<Flex direction={"row"} wrap={"wrap"} gap={"5px"}>
			{itemsFiltered.map((item, index) =>
				item ? (
					<HoverCard
						transitionProps={{ transition: "fade-up", duration: 300 }}
						shadow="md"
						width={300}
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						key={index}
					>
						<HoverCard.Target>
							<Image src={item.iconPath} h={30} w={30} radius="5px" />
						</HoverCard.Target>
						<HoverCard.Dropdown>
							<Title order={5}>{item.name}</Title>

							{item.stats.map((stat) => (
								<section className={styles.statsGrid} key={stat.name}>
									<Text>{stat.value}</Text>
									<Text c="dimmed">{stat.name}</Text>
								</section>
							))}

							{item.abilities.length > 0 && item.stats.length > 0 && (
								<Space h="md" />
							)}

							{item.abilities.map((ability) => (
								<Flex key={ability.name} direction={"column"}>
									<Title order={5}>{ability.name}</Title>
									<Text c="dimmed">{ability.description}</Text>
								</Flex>
							))}
						</HoverCard.Dropdown>
					</HoverCard>
				) : (
					<div
						key={`empty-item-${
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							index
						}`}
						className={styles.emptyItem}
					/>
				),
			)}
		</Flex>
	);
}
