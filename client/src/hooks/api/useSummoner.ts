import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../utils/trcp.ts";

export const useSummoner = (puuid: string, prefetchOnly?: boolean) => {
	if (prefetchOnly) {
		return useQuery(
			trpc.lol.getSummonerByPuuid.queryOptions(puuid, {
				notifyOnChangeProps: [],
			}),
		);
	}
	return useQuery(trpc.lol.getSummonerByPuuid.queryOptions(puuid));
};
