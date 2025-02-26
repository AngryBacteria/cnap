import { Card, Image, Text, Title } from "@mantine/core";
import { useNavigate } from "@tanstack/react-router";
import type { ChampionReducedDTO } from "../../model/Api.ts";
import {
	capitalizeFirstLetter,
	truncateText,
} from "../../utils/GeneralUtil.ts";
import styles from "./ChampionReducedCard.module.css";

interface ChampionCardProps {
	champion: ChampionReducedDTO;
}

export function ChampionReducedCard({ champion }: ChampionCardProps) {
	const navigate = useNavigate({});
	const goToChampionDetail = () => {
		void navigate({ to: `/champions/${champion.alias}` });
	};
	return (
		<Card
			withBorder
			className={styles.championCard}
			shadow="sm"
			onClick={goToChampionDetail}
		>
			<Card.Section>
				<Image src={champion.uncenteredSplashPath} />
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
		</Card>
	);
}
