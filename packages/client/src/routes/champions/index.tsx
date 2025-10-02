import { Alert, Flex, Loader, TextInput, Title } from "@mantine/core";
import { IconAlertSquareRounded } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { ChampionReducedCard } from "../../components/Champion/ChampionReducedCard/ChampionReducedCard.tsx";
import { useChampions } from "../../hooks/api/useChampions.ts";
import styles from "./index.module.css";

export const Route = createFileRoute("/champions/")({
	component: ChampionsPage,
});

function ChampionsPage() {
	const [nameSearch, setNameSearch] = useState<string>("");

	const championsQuery = useChampions();

	/**
	 * Filter the champions based on the name search
	 */
	const filteredChampions = useMemo(() => {
		if (!championsQuery.data) {
			return [];
		}

		return championsQuery.data
			.filter((champion) => {
				// Check if name or title matches
				if (champion.id === -1) {
					return false;
				}
				return (
					champion.name.toLowerCase().includes(nameSearch.toLowerCase()) ||
					champion.title.toLowerCase().includes(nameSearch.toLowerCase())
				);
			})
			.sort((a, b) => a.name.localeCompare(b.name));
	}, [championsQuery.data, nameSearch]);

	if (championsQuery.status === "pending") {
		return (
			<Flex
				justify={"center"}
				align={"center"}
				h={"calc(100vh - var(--app-shell-header-height))"}
				w={"100%"}
			>
				<Loader size="xl" type="dots" />
			</Flex>
		);
	}

	if (championsQuery.status === "error") {
		return (
			<Alert
				title={"Fehler beim Laden der Champions"}
				variant={"light"}
				color={"red"}
				icon={<IconAlertSquareRounded />}
			>
				Momentan können keine Champions geladen werden. Bitte versuche es später
				nochmal.
			</Alert>
		);
	}

	return (
		<section>
			<Title order={1} pb={"sm"}>
				League of legends Champions
			</Title>
			<section className={styles.filters}>
				<TextInput
					placeholder="Champion Name"
					onChange={(event) => setNameSearch(event.currentTarget.value)}
				/>
			</section>

			<section className={styles.champions}>
				<AnimatePresence mode={"popLayout"}>
					{filteredChampions.map((champion) => {
						return (
							<motion.div
								className={"fillSpacePointer"}
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.9 }}
								transition={{ duration: 0.25 }}
								key={champion.id}
							>
								<ChampionReducedCard champion={champion} />
							</motion.div>
						);
					})}
				</AnimatePresence>
			</section>
		</section>
	);
}
