import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { type Inputs, trpc } from "../../utils/trcp.ts";

export const useMatchesParticipant = (
	queryParams: Inputs["lol"]["getMatchesParticipant"],
	prefetchOnly?: boolean,
) => {
	const options = prefetchOnly
		? trpc.lol.getMatchesParticipant.queryOptions(queryParams, {
				notifyOnChangeProps: [],
				placeholderData: keepPreviousData,
			})
		: trpc.lol.getMatchesParticipant.queryOptions(queryParams, {
				placeholderData: keepPreviousData,
			});
	return useQuery(options);
};
