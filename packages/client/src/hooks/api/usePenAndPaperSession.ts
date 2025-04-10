import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../utils/trcp.ts";

export const usePenAndPaperSession = (
	objectId: string,
	prefetchOnly?: boolean,
) => {
	if (prefetchOnly) {
		return useQuery(
			trpc.penAndPaper.getSession.queryOptions(objectId, {
				notifyOnChangeProps: [],
			}),
		);
	}
	return useQuery(trpc.penAndPaper.getSession.queryOptions(objectId));
};
