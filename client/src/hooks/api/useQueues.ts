import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../utils/trcp.ts";

export const useQueues = () => {
	return useQuery(trpc.queues.queryOptions());
};
