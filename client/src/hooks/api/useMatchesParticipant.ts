import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../utils/trcp.ts";

export const useMatchesParticipant = (
	page: number,
	championId?: number,
	queueId?: string | null,
	onlySummonersInDb = true,
	prefetchOnly?: boolean,
) => {
	const queryParams = {
		championId,
		queueId: queueId ? Number.parseInt(queueId) : undefined,
		onlySummonersInDb,
		page,
	};

	if (prefetchOnly) {
		return useQuery(
			trpc.lol.getMatchesParticipant.queryOptions(queryParams, {
				notifyOnChangeProps: [],
			}),
		);
	}
	return useQuery(trpc.lol.getMatchesParticipant.queryOptions(queryParams));
};
