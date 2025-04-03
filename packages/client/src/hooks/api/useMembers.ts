import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../utils/trcp.ts";

export const useMembers = (onlyCore: boolean, prefetchOnly?: boolean) => {
	if (prefetchOnly) {
		return useQuery(
			trpc.general.getMembers.queryOptions(
				{ onlyCore },
				{ notifyOnChangeProps: [] },
			),
		);
	}
	return useQuery(trpc.general.getMembers.queryOptions({ onlyCore }));
};
