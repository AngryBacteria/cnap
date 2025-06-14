import { Alert, Flex, Loader, Pagination } from "@mantine/core";
import { IconAlertSquareRounded } from "@tabler/icons-react";
import { useMatchesParticipant } from "../../hooks/api/useMatchesParticipant.ts";
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

	if (matchesParticipantQuery.status === "pending") {
		return <Loader color={PRIMARY_COLOR} />;
	}

	if (matchesParticipantQuery.status === "error") {
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
					key={`${match.participant.matchId} - ${match.participant.matchId}`}
					match={match}
				/>
			))}
			<Pagination
				total={matchesParticipantQuery.data.pagination.totalPages}
				value={page}
				onChange={setPage}
			/>
		</Flex>
	);
}
