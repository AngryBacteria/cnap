import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../utils/trcp.ts";

export const useChampions = (prefetchOnly?: boolean) => {
	const queryOptions = prefetchOnly
		? trpc.lol.getChampionsReduced.queryOptions(undefined, {
				notifyOnChangeProps: [],
			})
		: trpc.lol.getChampionsReduced.queryOptions();
	return useQuery(queryOptions);
};
