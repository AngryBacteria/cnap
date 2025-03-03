import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../utils/trcp.ts";

export const useSummoners = () => {
	return useQuery(trpc.getSummoners.queryOptions());
};
