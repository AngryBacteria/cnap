import { useQuery } from "@tanstack/react-query";
import type { MatchV5SingleDTO } from "../../model/Api";

export interface ChampionMatchesAPIResponse {
	page: number;
	maxPage: number;
	data: MatchV5SingleDTO[];
}

export const useChampionMatches = (
	championId: number,
	page: number,
	queue_id?: string | null,
	only_summoners_in_db = true,
) => {
	const championMatchesQuery = useQuery({
		queryKey: [
			"matchesChampion",
			championId,
			page,
			queue_id,
			only_summoners_in_db,
		],
		queryFn: async () => {
			const params = new URLSearchParams({
				only_summoners_in_db: only_summoners_in_db.toString(),
				page: page.toString(),
			});
			if (queue_id) {
				params.append("queue_id", queue_id);
			}

			const response = await fetch(
				`http://localhost:8000/matches/champion/${championId}?${params.toString()}`,
			);
			if (!response.ok) {
				throw new Error("Failed to load champion matches data");
			}

			return (await response.json()) as ChampionMatchesAPIResponse;
		},
	});

	return championMatchesQuery;
};
