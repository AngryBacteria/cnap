import { useQuery } from "@tanstack/react-query";
import { type Inputs, trpc } from "../../utils/trcp.ts";

export const useSummoner = (
	queryParams: Inputs["lol"]["getSummonerByName"],
	prefetchOnly?: boolean,
) => {
	if (prefetchOnly) {
		return useQuery(
			trpc.lol.getSummonerByName.queryOptions(queryParams, {
				notifyOnChangeProps: [],
			}),
		);
	}
	return useQuery(trpc.lol.getSummonerByName.queryOptions(queryParams));
};
