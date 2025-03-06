import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../utils/trcp.ts";

export const useMatchesParticipant = (
	page: number,
	championId?: number,
	queueId?: string | null,
	onlySummonersInDb = true,
) => {
	return useQuery(
		trpc.lol.getMatchesParticipant.queryOptions({
			championId,
			queueId: queueId ? Number.parseInt(queueId) : undefined,
			onlySummonersInDb,
			page,
		}),
	);
};
