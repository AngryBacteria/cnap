import { useQuery } from "@tanstack/react-query";
import { type Inputs, trpc } from "../../utils/trcp.ts";

export const useMatchesParticipant = (
	queryParams: Inputs["lol"]["getMatchesParticipant"],
	prefetchOnly?: boolean,
) => {
	const options = prefetchOnly
		? trpc.lol.getMatchesParticipant.queryOptions(queryParams, {
				notifyOnChangeProps: [],
			})
		: trpc.lol.getMatchesParticipant.queryOptions(queryParams);
	return useQuery(options);
};
