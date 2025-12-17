import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../utils/trcp.ts";

export const useMembers = (onlyCore: boolean, prefetchOnly?: boolean) => {
	const options = prefetchOnly
		? trpc.general.getMembers.queryOptions(
				{ onlyCore },
				{ notifyOnChangeProps: [] },
			)
		: trpc.general.getMembers.queryOptions({ onlyCore });
	return useQuery(options);
};
