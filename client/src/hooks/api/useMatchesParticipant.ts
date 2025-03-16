import { useQuery } from "@tanstack/react-query";
import { type Inputs, trpc } from "../../utils/trcp.ts";

// TODO: Keep previous data
export const useMatchesParticipant = (
	queryParams: Inputs["lol"]["getMatchesParticipant"],
	prefetchOnly?: boolean,
) => {
	if (prefetchOnly) {
		return useQuery(
			trpc.lol.getMatchesParticipant.queryOptions(queryParams, {
				notifyOnChangeProps: [],
			}),
		);
	}
	return useQuery(trpc.lol.getMatchesParticipant.queryOptions(queryParams));
};
