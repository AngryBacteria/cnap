import { Card, Flex, Image, Title } from "@mantine/core";
import type { SummonerDBDTO } from "../../model/Api";
import styles from "./SummonerCard.module.css";

interface Props {
	summoner: SummonerDBDTO;
}

export function SummonerCard({ summoner }: Props) {
	const summonerIconPath = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${summoner.profileIconId}.jpg`;

	return (
		<Card shadow={"md"} withBorder w={"100%"} className={styles.summonerCard}>
			<Card.Section>
				<Image
					src={summonerIconPath}
					alt={summoner.gameName}
					key={summoner.puuid}
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
	);
}
