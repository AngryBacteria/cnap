import { z } from "zod";

export const SummonerDbSchema = z
	.object({
		puuid: z.string(),
		accountId: z.string(),
		gameName: z.string(),
		id: z.string(),
		profileIconId: z.number(),
		revisionDate: z.number(),
		summonerLevel: z.number(),
		tagLine: z.string(),
	})
	.passthrough();
export type SummonerDb = z.infer<typeof SummonerDbSchema>;
