import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../utils/trcp.ts";

export const usePenAndPaperSessions = (campaign?: string) => {
	const options = trpc.penAndPaper.getSessions.queryOptions({ campaign });
	return useQuery(options);
};
