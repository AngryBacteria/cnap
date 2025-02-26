import { Alert, Loader, Pagination, Select, Title } from "@mantine/core";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useChampionMatches } from "../../hooks/api/useChampionMatches";
import { useItems } from "../../hooks/api/useItems";
import { useQueues } from "../../hooks/api/useQueues";
import { useSummonerSpells } from "../../hooks/api/useSummonerSpells";
import { MatchBannerSummary } from "./MatchBannerSummary/MatchBannerSummary";

export interface Props {
	championId: number;
}

export function ChampionMatchesLoader({ championId }: Props) {
	//TODO: replace with router search param
	//TODO: put in own component
	const [selectedQueue, setSelectedQueue] = useState<string | null>(null);
	const { page } = useSearch({ from: "/champions/$championAlias" });
	const navigate = useNavigate({ from: "/champions/$championAlias" });
	const handlePageChange = (newPage: number) => {
		navigate({
			search: { page: newPage },
		});
	};

	const championMatchesQuery = useChampionMatches(
		championId,
		page,
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
		championMatchesQuery.status === "pending" ||
		itemQuery.status === "pending" ||
		queuesQuery.status === "pending" ||
		summonerSpellsQuery.status === "pending"
	) {
		return <Loader color={"teal"} />;
	}

	if (
		championMatchesQuery.status === "error" ||
		itemQuery.status === "error" ||
		queuesQuery.status === "error" ||
		summonerSpellsQuery.status === "error"
	) {
		return <Alert title={"Error loading champion matches"} variant={"light"} />;
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

			{championMatchesQuery.data.data.map((match) => (
				<MatchBannerSummary
					key={`${match.info.gameId} - ${match.info.participants.puuid}`}
					match={match}
					queues={queuesQuery.data}
					summonerSpells={summonerSpellsQuery.data}
					items={itemQuery.data}
				/>
			))}
			<Pagination
				total={championMatchesQuery.data.maxPage}
				value={page}
				onChange={handlePageChange}
			/>
		</>
	);
}
