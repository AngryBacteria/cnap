import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../utils/trcp.ts";

export const useQueues = (prefetchOnly?: boolean) => {
	if (prefetchOnly) {
		return useQuery(
			trpc.lol.getQueues.queryOptions(undefined, { notifyOnChangeProps: [] }),
		);
	}
	return useQuery(trpc.lol.getQueues.queryOptions());
};
