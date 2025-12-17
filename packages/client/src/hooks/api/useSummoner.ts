import { useQuery } from "@tanstack/react-query";
import { type Inputs, trpc } from "../../utils/trcp.ts";

export const useSummoner = (
	queryParams: Inputs["lol"]["getSummonerByName"],
	prefetchOnly?: boolean,
) => {
	const options = prefetchOnly
		? trpc.lol.getSummonerByName.queryOptions(queryParams, {
				notifyOnChangeProps: [],
			})
		: trpc.lol.getSummonerByName.queryOptions(queryParams);
	return useQuery(options);
};
