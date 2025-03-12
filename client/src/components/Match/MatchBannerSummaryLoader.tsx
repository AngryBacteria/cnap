import { Alert, Loader, Pagination, Select, Title } from "@mantine/core";
import { IconAlertSquareRounded } from "@tabler/icons-react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useItems } from "../../hooks/api/useItems";
import { useMatchesParticipant } from "../../hooks/api/useMatchesParticipant.ts";
import { useQueues } from "../../hooks/api/useQueues";
import { useSummonerSpells } from "../../hooks/api/useSummonerSpells";
import { MatchBannerSummary } from "./MatchBannerSummary/MatchBannerSummary";

export interface Props {
	championId?: number;
}

export function MatchBannerSummaryLoader({ championId }: Props) {
	//TODO: replace with router search param
	//TODO: put in own component
	//TODO scroll to title
	const [selectedQueue, setSelectedQueue] = useState<string | null>(null);
	const { page } = useSearch({ from: "/champions/$championId" });
	const navigate = useNavigate({ from: "/champions/$championId" });
	const handlePageChange = (newPage: number) => {
		navigate({
			search: { page: newPage },
		});
	};

	const matchesParticipantQuery = useMatchesParticipant(
		page,
		championId,
		selectedQueue,
		true,
	);
	const itemQuery = useItems();
	const queuesQuery = useQueues();
	const summonerSpellsQuery = useSummonerSpells();

	const formattedQueues = useMemo(() => {
		const output = [];
		if (queuesQuery.data) {
			for (const queue of queuesQuery.data) {
				if (queue.notes?.includes("Deprecated")) {
					continue;
				}

				if (queue.queueId && queue.description) {
					output.push({
						value: `${queue.queueId}`,
						label: queue.description,
					});
				}
			}
		}
		return output;
	}, [queuesQuery.data]);

	if (
		matchesParticipantQuery.status === "pending" ||
		itemQuery.status === "pending" ||
		queuesQuery.status === "pending" ||
		summonerSpellsQuery.status === "pending"
	) {
		return <Loader color={"teal"} />;
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
		<>
			<Title order={2}>Matches from CnAP Players on this champion</Title>

			<Select
				maw={400}
				clearable
				searchable
				data={formattedQueues}
				value={selectedQueue}
				onChange={setSelectedQueue}
				label="Select a Queue (nothing means return all queues)"
			/>

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
				onChange={handlePageChange}
			/>
		</>
	);
}
