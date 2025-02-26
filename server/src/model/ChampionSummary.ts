import { z } from "zod";

export const ChampionSummarySchema = z.object({
	id: z.number(),
	name: z.string(),
	alias: z.string(),
	squarePortraitPath: z.string(),
	roles: z.array(z.string()),
});
export type ChampionSummary = z.infer<typeof ChampionSummarySchema>;
