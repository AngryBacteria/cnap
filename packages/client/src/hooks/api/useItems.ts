import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../utils/trcp.ts";

export const useItems = (prefetchOnly?: boolean) => {
	if (prefetchOnly) {
		return useQuery(
			trpc.lol.getItems.queryOptions(undefined, { notifyOnChangeProps: [] }),
		);
	}
	return useQuery(trpc.lol.getItems.queryOptions());
};
