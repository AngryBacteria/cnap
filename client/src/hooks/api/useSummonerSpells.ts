import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../utils/trcp.ts";

export const useSummonerSpells = (prefetchOnly?: boolean) => {
	if (prefetchOnly) {
		return useQuery(
			trpc.lol.getSummonerSpells.queryOptions(undefined, {
				notifyOnChangeProps: [],
			}),
		);
	}
	return useQuery(trpc.lol.getSummonerSpells.queryOptions());
};
