import { Alert, Flex, Loader, Pagination } from "@mantine/core";
import { IconAlertSquareRounded } from "@tabler/icons-react";
import { useItems } from "../../hooks/api/useItems";
import { useMatchesParticipant } from "../../hooks/api/useMatchesParticipant.ts";
import { useQueues } from "../../hooks/api/useQueues";
import { useSummonerSpells } from "../../hooks/api/useSummonerSpells";
import { PRIMARY_COLOR } from "../../main.tsx";
import { MatchBannerSummary } from "./MatchBannerSummary/MatchBannerSummary";

export interface Props {
	page: number;
	setPage: (page: number) => void;
	championId?: number;
	gameName?: string;
	tagLine?: string;
	queueId?: number;
}

export function MatchBannerSummaryLoader({
	championId,
	gameName,
	tagLine,
	page,
	setPage,
	queueId,
}: Props) {
	//TODO scroll to title

	const matchesParticipantQuery = useMatchesParticipant({
		page,
		championId,
		gameName,
		tagLine,
		queueId,
	});
	const itemQuery = useItems();
	const queuesQuery = useQueues();
	const summonerSpellsQuery = useSummonerSpells();

	if (
		matchesParticipantQuery.status === "pending" ||
		itemQuery.status === "pending" ||
		queuesQuery.status === "pending" ||
		summonerSpellsQuery.status === "pending"
	) {
		return <Loader color={PRIMARY_COLOR} />;
	}

	if (
		matchesParticipantQuery.status === "error" ||
		itemQuery.status === "error" ||
		queuesQuery.status === "error" ||
		summonerSpellsQuery.status === "error"
	) {
		return (
			<Alert
				title={"Fehler beim Laden der Matches"}
				variant={"light"}
				color={"red"}
				icon={<IconAlertSquareRounded />}
			>
				Momentan können keine Matches geladen werden. Bitte versuche es später
				nochmal.
			</Alert>
		);
	}

	return (
		<Flex direction={"column"} gap={"md"}>
			{matchesParticipantQuery.data.data.map((match) => (
				<MatchBannerSummary
					key={`${match.info.gameId} - ${match.info.participants.puuid}`}
					match={match}
					queues={queuesQuery.data}
					summonerSpells={summonerSpellsQuery.data}
					items={itemQuery.data}
				/>
			))}
			<Pagination
				total={matchesParticipantQuery.data.maxPage}
				value={page}
				onChange={setPage}
			/>
		</Flex>
	);
}
