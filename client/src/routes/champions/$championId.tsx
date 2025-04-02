import { Alert, Flex, Loader, Title } from "@mantine/core";
import { IconAlertSquareRounded } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChampionAbilitiesTabs } from "../../components/Champion/ChampionAbilities/ChampionAbilitiesTabs.tsx";
import { ChampionHeader } from "../../components/Champion/ChampionHeader.tsx";
import { ChampionSkins } from "../../components/Champion/ChampionSkins/ChampionSkins.tsx";
import { MatchBannerSummaryLoader } from "../../components/Match/MatchBannerSummaryLoader.tsx";
import { QueueIdSelector } from "../../components/Match/QueueIdSelector.tsx";
import { useChampion } from "../../hooks/api/useChampion.ts";
import { useItems } from "../../hooks/api/useItems.ts";
import { useMatchesParticipant } from "../../hooks/api/useMatchesParticipant.ts";
import { useQueues } from "../../hooks/api/useQueues.ts";
import { useSummonerSpells } from "../../hooks/api/useSummonerSpells.ts";

export const Route = createFileRoute("/champions/$championId")({
	component: ChampionPage,
});

export function ChampionPage() {
	const { championId } = Route.useParams();
	const [page, setPage] = useState<number>(1);
	const [selectedQueueId, setSelectedQueueId] = useState<string | null>(null);

	// Fetch champion
	const query = useChampion(Number(championId));

	// Prefetch data for the MatchBannerSummaryLoader
	useItems(true);
	useMatchesParticipant(
		{ page, championId: Number(championId), queueId: Number(selectedQueueId) },
		true,
	);
	useQueues(true);
	useSummonerSpells(true);

	if (query.status === "pending") {
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

	if (query.status === "error") {
		return (
			<Alert
				title={"Fehler beim Laden des Champions"}
				variant={"light"}
				color={"red"}
				icon={<IconAlertSquareRounded />}
			>
				Der Champion mit der ID ${championId} konnte nicht geladen werden. Bitte
				versuche es später nochmal.
			</Alert>
		);
	}

	return (
		<>
			<Flex direction={"column"} gap={"md"}>
				<ChampionHeader champion={query.data} />
				<ChampionAbilitiesTabs champion={query.data} />
				<ChampionSkins champion={query.data} />

				<Title order={2}>Matches from CnAP Players on this champion</Title>

				<QueueIdSelector
					selectedQueueId={selectedQueueId}
					setSelectedQueueId={setSelectedQueueId}
				/>

				<MatchBannerSummaryLoader
					championId={query.data.id}
					page={page}
					setPage={setPage}
					queueId={Number(selectedQueueId)}
				/>
			</Flex>
		</>
	);
}
