import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../utils/trcp.ts";

export const useChampions = (prefetchOnly?: boolean) => {
	if (prefetchOnly) {
		return useQuery(
			trpc.lol.getChampionsReduced.queryOptions(undefined, {
				notifyOnChangeProps: [],
			}),
		);
	}
	return useQuery(trpc.lol.getChampionsReduced.queryOptions());
};
