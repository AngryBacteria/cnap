import { Card, Flex, Image, Title } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import type { Outputs } from "../../utils/trcp.ts";
import styles from "./SummonerCard.module.css";

interface Props {
	summoner: Outputs["lol"]["getSummoners"][number];
}

export function SummonerCard({ summoner }: Props) {
	const summonerIconPath = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${summoner.profileIconId}.jpg`;

	return (
		<Card shadow={"md"} withBorder className={"fillSpacePointer"}>
			<Link
				to="/summoners/$summonerNameTag"
				params={{ summonerNameTag: `${summoner.gameName}-${summoner.tagLine}` }}
				className={styles.navigationItem}
			>
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
			</Link>
		</Card>
	);
}
