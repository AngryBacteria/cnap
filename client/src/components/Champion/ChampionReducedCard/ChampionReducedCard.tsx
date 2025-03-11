import { Card, Image, Text, Title } from "@mantine/core";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
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
	const navigate = useNavigate({});
	const goToChampionDetail = () => {
		void navigate({ to: `/champions/${champion.id}` });
	};
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.25 }}
		>
			<Card
				withBorder
				className={styles.championCard}
				shadow="sm"
				onClick={goToChampionDetail}
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
			</Card>
		</motion.div>
	);
}
