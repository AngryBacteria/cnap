import { Alert, Flex, Loader } from "@mantine/core";
import { IconAlertSquareRounded } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { useSummoner } from "../../hooks/api/useSummoner.ts";
import { useSummonerSummary } from "../../hooks/api/useSummonerSummary.ts";

export const Route = createFileRoute("/summoners/$summonerPuuid")({
	component: SummonerPage,
});

export function SummonerPage() {
	const { summonerPuuid } = Route.useParams();

	const summonerQuery = useSummoner(summonerPuuid);
	const summonerSummaryQuery = useSummonerSummary(summonerPuuid);

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

	return <h1>Hello {summonerPuuid}</h1>;
}
