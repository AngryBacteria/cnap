import { Card, Image, Text, Title } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import {
	capitalizeFirstLetter,
	truncateText,
} from "../../../utils/GeneralUtil.ts";
import type { Outputs } from "../../../utils/trcp.ts";
import styles from "./ChampionReducedCard.module.css";

interface ChampionCardProps {
	champion: Outputs["lol"]["getChampionsReduced"][number];
}

export function ChampionReducedCard({ champion }: ChampionCardProps) {
	return (
		<Card className={"fillSpacePointer"} withBorder shadow="sm">
			<Link
				to="/champions/$championId"
				params={{ championId: `${champion.id}` }}
				search={(prev) => ({ ...prev, page: 1 })}
				className={styles.navigationItem}
			>
				<Card.Section>
					<Image
						src={champion.uncenteredSplashPath}
						className={styles.imageContainer}
					/>
				</Card.Section>

				<section>
					<Title order={2} pt={"xs"} ta={"center"}>
						{champion.name}
					</Title>
					<Title order={5} c={"dimmed"} pb={"sm"} ta={"center"}>
						{capitalizeFirstLetter(champion.title)}
					</Title>
					<Text ta={"center"}>{truncateText(champion.shortBio, 100)}</Text>
				</section>
			</Link>
		</Card>
	);
}
