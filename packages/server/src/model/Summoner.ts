import { ObjectId } from "mongodb";
import { z } from "zod";

export const SummonerRiotSchema = z.object({
	accountId: z.string(),
	profileIconId: z.number(),
	revisionDate: z.number(),
	id: z.string(),
	puuid: z.string(),
	summonerLevel: z.number(),
});

export type SummonerRiot = z.infer<typeof SummonerRiotSchema>;

export const SummonerDbSchema = z.object({
	puuid: z.string(),
	accountId: z.string(),
	gameName: z.string(),
	id: z.string(),
	profileIconId: z.number(),
	revisionDate: z.number(),
	summonerLevel: z.number(),
	tagLine: z.string(),
	memberId: z.instanceof(ObjectId).nullish(),
});
export type SummonerDb = z.infer<typeof SummonerDbSchema>;
