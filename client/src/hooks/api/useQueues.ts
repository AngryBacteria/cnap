import { useQuery } from "@tanstack/react-query";
import type { QueueDTO } from "../../model/Api";

export const useQueues = () => {
	const queuesQuery = useQuery({
		queryKey: ["queues"],

		queryFn: async () => {
			const response = await fetch("http://localhost:8000/queues");
			if (!response.ok) {
				throw new Error("Failed to load queues data");
			}

			return (await response.json()) as QueueDTO[];
		},
	});

	return queuesQuery;
};
