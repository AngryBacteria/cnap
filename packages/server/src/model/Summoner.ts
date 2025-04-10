import { ObjectId } from "mongodb";
import { z } from "zod";
import { MongoDBIDSchema } from "./Database.js";

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
	_id: MongoDBIDSchema,
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

/**
 * The id of a summoner summary
 */
export const SummonerSummaryIdSchema = z.object({
	champion: z.string(),
	queueId: z.number(),
	teamPosition: z.string(),
});
export type SummonerSummaryId = z.infer<typeof SummonerSummaryIdSchema>;

/**
 * Summoner summary for a specific champion. Comes from a mongodb aggregation pipeline.
 */
export const SummonerSummarySchema = z.object({
	_id: SummonerSummaryIdSchema,
	totalMatches: z.number(),
	wins: z.number(),
	secondsPlayed: z.number(),
	kills: z.number(),
	deaths: z.number(),
	assists: z.number(),
	doubleKills: z.number(),
	tripleKills: z.number(),
	quadraKills: z.number(),
	pentaKills: z.number(),
	totalVisionScore: z.number(),
});
export type SummonerSummary = z.infer<typeof SummonerSummarySchema>;
