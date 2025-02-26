import { useQuery } from "@tanstack/react-query";
import type { SummonerSpellDTO } from "../../model/Api";

export const useSummonerSpells = () => {
	const summonerSpellsQuery = useQuery({
		queryKey: ["summonerSpells"],
		queryFn: async () => {
			const response = await fetch("http://localhost:8000/summoner-spells");
			if (!response.ok) {
				throw new Error("Failed to load summoner spells data");
			}

			return (await response.json()) as SummonerSpellDTO[];
		},
	});

	return summonerSpellsQuery;
};
