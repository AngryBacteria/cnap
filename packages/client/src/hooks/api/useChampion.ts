import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../utils/trcp.ts";

export const useChampion = (championId: number) => {
	return useQuery(trpc.lol.getChampionById.queryOptions(championId));
};
