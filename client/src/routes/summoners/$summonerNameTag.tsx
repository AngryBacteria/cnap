import { Alert, Flex, Loader, Title } from "@mantine/core";
import { IconAlertSquareRounded } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChampionIdSelector } from "../../components/Match/ChampionIdSelector.tsx";
import { MatchBannerSummaryLoader } from "../../components/Match/MatchBannerSummaryLoader.tsx";
import { QueueIdSelector } from "../../components/Match/QueueIdSelector.tsx";
import { useItems } from "../../hooks/api/useItems.ts";
import { useQueues } from "../../hooks/api/useQueues.ts";
import { useSummoner } from "../../hooks/api/useSummoner.ts";
import { useSummonerSpells } from "../../hooks/api/useSummonerSpells.ts";
import { useSummonerSummary } from "../../hooks/api/useSummonerSummary.ts";

export const Route = createFileRoute("/summoners/$summonerNameTag")({
	component: SummonerPage,
});

export function SummonerPage() {
	const { summonerNameTag } = Route.useParams();
	const [page, setPage] = useState<number>(1);

	const [selectedQueueId, setSelectedQueueId] = useState<string | null>(null);
	const [selectedChampionId, setSelectedChampionId] = useState<string | null>(
		null,
	);

	const gameName = summonerNameTag.split("-")[0];
	const tagLine = summonerNameTag.split("-")[1];

	const summonerQuery = useSummoner({ gameName, tagLine });
	const summonerSummaryQuery = useSummonerSummary({ gameName, tagLine });

	// Preloading
	useItems(true);
	useQueues(true);
	useSummonerSpells(true);

	if (
		summonerQuery.status === "pending" ||
		summonerSummaryQuery.status === "pending"
	) {
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

	if (
		summonerQuery.status === "error" ||
		summonerSummaryQuery.status === "error"
	) {
		return (
			<Alert
				title={"Fehler beim des Summoners"}
				variant={"light"}
				color={"red"}
				icon={<IconAlertSquareRounded />}
			>
				Momentan kann dieser Summoner nicht angezeigt werden. Bitte versuche es
				später erneut.
			</Alert>
		);
	}

	return (
		<>
			<Flex direction={"column"} gap={"md"}>
				<Title order={2}>Matches from {summonerQuery.data.gameName}</Title>

				<Flex direction={"row"} gap={"md"} wrap={"wrap"}>
					<QueueIdSelector
						selectedQueueId={selectedQueueId}
						setSelectedQueueId={setSelectedQueueId}
					/>
					<ChampionIdSelector
						selectedChampionId={selectedChampionId}
						setSelectedChampionId={setSelectedChampionId}
					/>
				</Flex>

				<MatchBannerSummaryLoader
					summonerPuuid={summonerQuery.data.puuid}
					page={page}
					setPage={setPage}
					queueId={Number(selectedQueueId)}
					championId={Number(selectedChampionId)}
				/>
			</Flex>
		</>
	);
}
