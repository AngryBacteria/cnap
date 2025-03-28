import { useQuery } from "@tanstack/react-query";
import { type Inputs, trpc } from "../../utils/trcp.ts";

export const useSummonerSummary = (
	queryParams: Inputs["lol"]["getSummonerSummaryByName"],
	prefetchOnly?: boolean,
) => {
	if (prefetchOnly) {
		return useQuery(
			trpc.lol.getSummonerSummaryByName.queryOptions(queryParams, {
				notifyOnChangeProps: [],
			}),
		);
	}
	return useQuery(trpc.lol.getSummonerSummaryByName.queryOptions(queryParams));
};
