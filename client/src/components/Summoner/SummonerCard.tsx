import { Card, Flex, Image, Title } from "@mantine/core";
import { motion } from "motion/react";
import type { Outputs } from "../../utils/trcp.ts";
import styles from "./SummonerCard.module.css";

interface Props {
	summoner: Outputs["lol"]["getSummoners"][number];
}

export function SummonerCard({ summoner }: Props) {
	const summonerIconPath = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${summoner.profileIconId}.jpg`;

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.25 }}
		>
			<Card shadow={"md"} withBorder className={styles.summonerCard}>
				<Card.Section>
					<Image
						src={summonerIconPath}
						alt={summoner.gameName}
						key={summoner.puuid}
						className={styles.imageContainer}
					/>
				</Card.Section>

				<Card.Section p={"xs"}>
					<Flex
						direction={"row"}
						columnGap={"md"}
						align={"center"}
						justify={"center"}
						wrap={"wrap"}
					>
						<Title ta={"center"} order={2}>
							{summoner.gameName}
						</Title>
						<Title order={3} c={"dimmed"}>
							#{summoner.tagLine}
						</Title>
					</Flex>
					<Title ta={"center"} order={3} c={"dimmed"}>
						Level: {summoner.summonerLevel}
					</Title>
				</Card.Section>
			</Card>
		</motion.div>
	);
}
