import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../utils/trcp.ts";

export const useCampaignOptions = () => {
	const options = trpc.penAndPaper.getCampaignOptions.queryOptions();
	return useQuery(options);
};
