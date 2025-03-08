import { Alert, Flex, Loader } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";
import { ChampionAbilitiesTabs } from "../../components/Champion/ChampionAbilities/ChampionAbilitiesTabs.tsx";
import { ChampionHeader } from "../../components/Champion/ChampionHeader.tsx";
import { ChampionSkins } from "../../components/Champion/ChampionSkins/ChampionSkins.tsx";
import { MatchBannerSummaryLoader } from "../../components/Match/MatchBannerSummaryLoader.tsx";
import { useChampion } from "../../hooks/api/useChampion.ts";

type ChampionSearch = {
	page: number;
};

export const Route = createFileRoute("/champions/$championAlias")({
	component: ChampionPage,
	validateSearch: (search: Record<string, unknown>): ChampionSearch => {
		return {
			page: Number(search?.page ?? 1),
		};
	},
});

export function ChampionPage() {
	const { championAlias } = Route.useParams();

	const query = useChampion(championAlias);

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
			<Alert title={"No champions found"} variant={"light"}>
				The Champion with Name: {championAlias} does not exist.
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
