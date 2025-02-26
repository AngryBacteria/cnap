import { useQuery } from "@tanstack/react-query";
import type { SummonerDBDTO } from "../../model/Api";

export const useSummoners = () => {
	const query = useQuery({
		queryKey: ["summoners"],

		queryFn: async () => {
			const response = await fetch("http://localhost:8000/summoners");
			if (!response.ok) {
				throw new Error("Failed to load summoners data");
			}

			return (await response.json()) as SummonerDBDTO[];
		},
	});

	return query;
};
