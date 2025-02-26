import { z } from "zod";

export const SummonerSchema = z.object({
	accountId: z.string(),
	profileIconId: z.number(),
	revisionDate: z.number(),
	id: z.string(),
	puuid: z.string(),

	summonerLevel: z.number(),
});
export type Summoner = z.infer<typeof SummonerSchema>;
