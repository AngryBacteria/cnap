import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../utils/trcp.ts";

export const usePenAndPaperSessions = (prefetchOnly?: boolean) => {
	if (prefetchOnly) {
		return useQuery(
			trpc.penAndPaper.getSessions.queryOptions(undefined, {
				notifyOnChangeProps: [],
			}),
		);
	}
	return useQuery(trpc.penAndPaper.getSessions.queryOptions());
};
