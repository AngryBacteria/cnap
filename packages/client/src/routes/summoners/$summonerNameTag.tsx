import { Alert, Flex, Loader, Title } from "@mantine/core";
import { IconAlertSquareRounded } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChampionIdSelector } from "../../components/Match/ChampionIdSelector.tsx";
import { MatchBannerSummaryLoader } from "../../components/Match/MatchBannerSummaryLoader.tsx";
import { QueueIdSelector } from "../../components/Match/QueueIdSelector.tsx";
import { useMatchesParticipant } from "../../hooks/api/useMatchesParticipant.ts";
import { useSummoner } from "../../hooks/api/useSummoner.ts";

export const Route = createFileRoute("/summoners/$summonerNameTag")({
	component: SummonerPage,
});

function SummonerPage() {
	const { summonerNameTag } = Route.useParams();
	const [page, setPage] = useState<number>(1);

	const [selectedQueueId, setSelectedQueueId] = useState<string | null>(null);
	const [selectedChampionId, setSelectedChampionId] = useState<string | null>(
		null,
	);

	const gameName = summonerNameTag.split("-")[0];
	const tagLine = summonerNameTag.split("-")[1];

	const summonerQuery = useSummoner({ gameName, tagLine });

	// Preloading
	useMatchesParticipant(
		{
			page,
			championId: Number(selectedChampionId),
			queueId: Number(selectedQueueId),
			gameName,
			tagLine,
		},
		true,
	);

	if (summonerQuery.status === "pending") {
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

	if (summonerQuery.status === "error") {
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
				gameName={gameName}
				tagLine={tagLine}
				page={page}
				setPage={setPage}
				queueId={Number(selectedQueueId)}
				championId={Number(selectedChampionId)}
			/>
		</Flex>
	);
}
