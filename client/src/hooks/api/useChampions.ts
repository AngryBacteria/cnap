import { useQuery } from "@tanstack/react-query";
import type { ChampionReducedDTO } from "../../model/Api";

export const useChampions = () => {
	const query = useQuery({
		queryKey: ["champions"],
		queryFn: async () => {
			const response = await fetch("http://localhost:8000/champions/reduced");
			if (!response.ok) {
				throw new Error("Failed to load champion data");
			}

			const data = (await response.json()) as ChampionReducedDTO[];
			if (data && data.length > 0) {
				return data;
			}
		},
	});

	return query;
};
