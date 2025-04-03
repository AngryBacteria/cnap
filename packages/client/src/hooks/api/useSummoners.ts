import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../utils/trcp.ts";

export const useSummoners = (prefetchOnly?: boolean) => {
	if (prefetchOnly) {
		return useQuery(
			trpc.lol.getSummoners.queryOptions(undefined, {
				notifyOnChangeProps: [],
			}),
		);
	}
	return useQuery(trpc.lol.getSummoners.queryOptions());
};
