import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../utils/trcp.ts";

export const useChampion = (championAlias: string) => {
	return useQuery(trpc.lol.getChampionByAlias.queryOptions(championAlias));
};
