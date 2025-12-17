import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../utils/trcp.ts";

export const useQueues = (prefetchOnly?: boolean) => {
	const options = prefetchOnly
		? trpc.lol.getQueues.queryOptions(undefined, { notifyOnChangeProps: [] })
		: trpc.lol.getQueues.queryOptions();
	return useQuery(options);
};
