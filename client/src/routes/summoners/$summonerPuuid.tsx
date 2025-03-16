import { Alert, Flex, Loader } from "@mantine/core";
import { IconAlertSquareRounded } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MatchBannerSummaryLoader } from "../../components/Match/MatchBannerSummaryLoader.tsx";
import { useItems } from "../../hooks/api/useItems.ts";
import { useMatchesParticipant } from "../../hooks/api/useMatchesParticipant.ts";
import { useQueues } from "../../hooks/api/useQueues.ts";
import { useSummoner } from "../../hooks/api/useSummoner.ts";
import { useSummonerSpells } from "../../hooks/api/useSummonerSpells.ts";
import { useSummonerSummary } from "../../hooks/api/useSummonerSummary.ts";

export const Route = createFileRoute("/summoners/$summonerPuuid")({
	component: SummonerPage,
});

export function SummonerPage() {
	const { summonerPuuid } = Route.useParams();
	const [page, setPage] = useState<number>(1);

	const summonerQuery = useSummoner(summonerPuuid);
	const summonerSummaryQuery = useSummonerSummary(summonerPuuid);

	// Preloading
	useMatchesParticipant(
		{
			page,
			summonerPuuid,
		},
		true,
	);
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
			<h1>Hello {summonerPuuid}</h1>
			<p>Summoner Name: {summonerQuery.data.gameName}</p>
			<p>Summary entries: {summonerSummaryQuery.data.length}</p>

			<MatchBannerSummaryLoader
				summonerPuuid={summonerPuuid}
				page={page}
				setPage={setPage}
			/>
		</>
	);
}
