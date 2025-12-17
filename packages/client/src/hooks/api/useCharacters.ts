import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../utils/trcp.ts";

export const useCharacters = () => {
	const options = trpc.penAndPaper.getCharacters.queryOptions();
	return useQuery(options);
};
