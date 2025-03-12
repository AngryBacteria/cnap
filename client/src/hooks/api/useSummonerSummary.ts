import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../utils/trcp.ts";

export const useSummonerSummary = (puuid: string, prefetchOnly?: boolean) => {
	if (prefetchOnly) {
		return useQuery(
			trpc.lol.getSummonerSummaryByPuuid.queryOptions(puuid, {
				notifyOnChangeProps: [],
			}),
		);
	}
	return useQuery(trpc.lol.getSummonerSummaryByPuuid.queryOptions(puuid));
};
