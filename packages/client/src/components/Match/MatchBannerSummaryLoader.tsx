import { Alert, Box, Flex, Loader, Pagination } from "@mantine/core";
import { IconAlertSquareRounded } from "@tabler/icons-react";
import { type JSX, useState } from "react";
import { useMatchesParticipant } from "../../hooks/api/useMatchesParticipant.ts";
import { PRIMARY_COLOR } from "../../main.tsx";
import { ChampionIdSelector } from "./ChampionIdSelector.tsx";
import { LaneSelector } from "./LaneSelector.tsx";
import { MatchBannerSummary } from "./MatchBannerSummary/MatchBannerSummary";
import { QueueIdSelector } from "./QueueIdSelector.tsx";

export interface Props {
	gameName?: string;
	tagLine?: string;
	championIdOverride?: number;
}

export function MatchBannerSummaryLoader({
	gameName,
	tagLine,
	championIdOverride,
}: Props) {
	const [selectedQueueId, setSelectedQueueId] = useState<string | null>(null);
	const [selectedChampionId, setSelectedChampionId] = useState<string | null>(
		null,
	);
	const [selectedLane, setSelectedLane] = useState<string | null>(null);

	const [page, setPage] = useState<number>(1);

	const matchesParticipantQuery = useMatchesParticipant({
		page,
		gameName,
		tagLine,
		queueId: selectedQueueId ? Number(selectedQueueId) : undefined,
		championId: selectedChampionId
			? Number(selectedChampionId)
			: championIdOverride,
		lane: selectedLane || undefined,
	});
	const isLoading = matchesParticipantQuery.isLoading;

	let mainContent: JSX.Element = <></>;
	if (matchesParticipantQuery.status === "pending") {
		mainContent = <Loader color={PRIMARY_COLOR} />;
	} else if (matchesParticipantQuery.status === "error") {
		mainContent = (
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
	} else {
		mainContent = (
			<Flex direction={"column"} gap={"md"}>
				{matchesParticipantQuery.data.data.map((match) => (
					<MatchBannerSummary key={match.participant.matchId} match={match} />
				))}
				<Pagination
					total={matchesParticipantQuery.data.pagination.totalPages}
					value={page}
					onChange={setPage}
					disabled={isLoading}
				/>
			</Flex>
		);
	}

	return (
		<Flex direction={"column"} gap={"md"}>
			<Flex direction={{ base: "column", sm: "row" }} gap="md">
				<Box style={{ flex: 1 }}>
					<QueueIdSelector
						selectedQueueId={selectedQueueId}
						setSelectedQueueId={setSelectedQueueId}
						disabled={isLoading}
					/>
				</Box>
				{championIdOverride === undefined && (
					<Box style={{ flex: 1 }}>
						<ChampionIdSelector
							selectedChampionId={selectedChampionId}
							setSelectedChampionId={setSelectedChampionId}
							disabled={isLoading}
						/>
					</Box>
				)}
				<Box style={{ flex: 1 }}>
					<LaneSelector
						selectedLane={selectedLane}
						setSelectedLane={setSelectedLane}
						disabled={isLoading}
					/>
				</Box>
			</Flex>
			{mainContent}
		</Flex>
	);
}
