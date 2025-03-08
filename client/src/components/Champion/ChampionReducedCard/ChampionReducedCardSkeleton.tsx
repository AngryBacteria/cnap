import { Card, Skeleton } from "@mantine/core";

import styles from "./ChampionReducedCard.module.css";

export function ChampionReducedCardSkeleton() {
	return (
		<Card withBorder className={styles.championCard} shadow="sm">
			<Card.Section>
				<Skeleton className={styles.imageContainer} />
			</Card.Section>

			<section>
				<Skeleton height={180} radius="md" mt={"xs"} />
			</section>
		</Card>
	);
}
