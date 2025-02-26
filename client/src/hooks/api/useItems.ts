import { useQuery } from "@tanstack/react-query";
import type { ItemDTO } from "../../model/Api";

export const useItems = () => {
	const itemQuery = useQuery({
		queryKey: ["items"],

		queryFn: async () => {
			const response = await fetch("http://localhost:8000/items");
			if (!response.ok) {
				throw new Error("Failed to load iktem data");
			}

			return (await response.json()) as ItemDTO[];
		},
	});

	return itemQuery;
};
