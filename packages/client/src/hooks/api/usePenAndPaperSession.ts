import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../utils/trcp.ts";

export const usePenAndPaperSession = (
	sessionId: number,
	prefetchOnly?: boolean,
) => {
	if (prefetchOnly) {
		return useQuery(
			trpc.penAndPaper.getSession.queryOptions(sessionId, {
				notifyOnChangeProps: [],
			}),
		);
	}
	return useQuery(trpc.penAndPaper.getSession.queryOptions(sessionId));
};
