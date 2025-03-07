import { Card, Skeleton } from "@mantine/core";
import styles from "./SummonerCard.module.css";

export function SummonerCardSkeleton() {
	return (
		<Card shadow={"md"} withBorder className={styles.summonerCard}>
			<Card.Section>
				<Skeleton className={styles.imageContainer} />
			</Card.Section>

			<Card.Section p={"xs"}>
				<Skeleton height={30} radius="xl" />
				<Skeleton height={30} radius="xl" mt={5} />
			</Card.Section>
		</Card>
	);
}
