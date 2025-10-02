import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../utils/trcp.ts";

export const usePenAndPaperSession = (
	sessionId: number,
	prefetchOnly?: boolean,
) => {
	const options = prefetchOnly
		? trpc.penAndPaper.getSession.queryOptions(sessionId, {
				notifyOnChangeProps: [],
			})
		: trpc.penAndPaper.getSession.queryOptions(sessionId);
	return useQuery(options);
};
