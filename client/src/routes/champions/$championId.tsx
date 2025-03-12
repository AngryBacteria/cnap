import { Alert, Flex, Loader } from "@mantine/core";
import { IconAlertSquareRounded } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { ChampionAbilitiesTabs } from "../../components/Champion/ChampionAbilities/ChampionAbilitiesTabs.tsx";
import { ChampionHeader } from "../../components/Champion/ChampionHeader.tsx";
import { ChampionSkins } from "../../components/Champion/ChampionSkins/ChampionSkins.tsx";
import { MatchBannerSummaryLoader } from "../../components/Match/MatchBannerSummaryLoader.tsx";
import { useChampion } from "../../hooks/api/useChampion.ts";
import { useItems } from "../../hooks/api/useItems.ts";
import { useMatchesParticipant } from "../../hooks/api/useMatchesParticipant.ts";
import { useQueues } from "../../hooks/api/useQueues.ts";
import { useSummonerSpells } from "../../hooks/api/useSummonerSpells.ts";

type ChampionSearch = {
	page: number;
};

export const Route = createFileRoute("/champions/$championId")({
	component: ChampionPage,
	validateSearch: (search: Record<string, unknown>): ChampionSearch => {
		return {
			page: Number(search?.page ?? 1),
		};
	},
});

export function ChampionPage() {
	const { championId } = Route.useParams();
	const { page } = Route.useSearch();

	// Fetch champion
	const query = useChampion(Number(championId));

	// Prefetch data for the next page
	useMatchesParticipant(page, Number(championId), "", true, true);
	useItems(true);
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

				<MatchBannerSummaryLoader championId={query.data.id} />
			</Flex>
		</>
	);
}
