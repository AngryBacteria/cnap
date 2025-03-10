import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../utils/trcp.ts";

export const useMembers = (onlyCore: boolean) => {
	return useQuery(trpc.general.getMembers.queryOptions({ onlyCore }));
};
