import { z } from "zod";

export const SummonerSummaryIdSchema = z.object({
	champion: z.string(),
	queueId: z.number(),
	teamPosition: z.string(),
});
export type SummonerSummaryId = z.infer<typeof SummonerSummaryIdSchema>;

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
