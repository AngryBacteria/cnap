import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../utils/trcp.ts";

export const useSummoners = (prefetchOnly?: boolean) => {
	const options = prefetchOnly
		? trpc.lol.getSummoners.queryOptions(undefined, {
				notifyOnChangeProps: [],
			})
		: trpc.lol.getSummoners.queryOptions();
	return useQuery(options);
};
