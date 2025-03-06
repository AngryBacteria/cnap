import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../utils/trcp.ts";

export const useChampions = () => {
	return useQuery(trpc.lol.getChampionsReduced.queryOptions());
};
