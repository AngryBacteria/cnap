import { z } from "zod";

export const SummonerRiotSchema = z.object({
	profileIconId: z.number(),
	revisionDate: z.number(),
	puuid: z.string(),
	summonerLevel: z.number(),
});

export type SummonerRiot = z.infer<typeof SummonerRiotSchema>;

export const SummonerDbSchema = z.object({
	puuid: z.string(),
	profileIconId: z.number(),
	revisionDate: z.number(),
	summonerLevel: z.number(),
	tagLine: z.string(),
	gameName: z.string(),
});
export type SummonerDb = z.infer<typeof SummonerDbSchema>;
