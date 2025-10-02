import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../utils/trcp.ts";

export const usePenAndPaperSessions = (prefetchOnly?: boolean) => {
	const options = prefetchOnly
		? trpc.penAndPaper.getSessions.queryOptions(undefined, {
				notifyOnChangeProps: [],
			})
		: trpc.penAndPaper.getSessions.queryOptions();
	return useQuery(options);
};
