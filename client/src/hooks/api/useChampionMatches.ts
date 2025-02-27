import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../utils/trcp.ts";

export const useChampionMatches = (
	championId: number,
	page: number,
	queue_id?: string | null,
	only_summoners_in_db = true,
) => {
	return useQuery(
		trpc.matchesByChampion.queryOptions({
			championId,
			queueId: queue_id ? Number.parseInt(queue_id) : undefined,
			onlySummonersInDb: only_summoners_in_db,
			page,
		}),
	);
};
