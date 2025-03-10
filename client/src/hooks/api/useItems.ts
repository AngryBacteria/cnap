import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../utils/trcp.ts";

export const useItems = () => {
	return useQuery(trpc.lol.getItems.queryOptions());
};
