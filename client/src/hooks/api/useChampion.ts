import { useQuery } from "@tanstack/react-query";
import type { ChampionDTO } from "../../model/Api";

export const useChampion = (championAlias: string) => {
	const query = useQuery({
		queryKey: ["champion", championAlias],
		queryFn: async () => {
			const response = await fetch(
				`http://localhost:8000/champion/${championAlias}`,
			);
			if (!response.ok) {
				throw new Error("Failed to load champion data");
			}

			return (await response.json()) as ChampionDTO;
		},
	});

	return query;
};
