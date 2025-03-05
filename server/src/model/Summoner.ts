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

export const SummonerDbSchema = z.object({
	puuid: z.string(),
	accountId: z.string(),
	gameName: z.string(),
	id: z.string(),
	profileIconId: z.number(),
	revisionDate: z.number(),
	summonerLevel: z.number(),
	tagLine: z.string(),
});
export type SummonerDb = z.infer<typeof SummonerDbSchema>;
