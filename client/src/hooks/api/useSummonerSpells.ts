import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../utils/trcp.ts";

export const useSummonerSpells = () => {
	return useQuery(trpc.getSummonerSpells.queryOptions());
};
