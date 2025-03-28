import { z } from "zod";
import { SummonerDbSchema } from "./Summoner.js";

export const MemberSchema = z.object({
	name: z.string().nullish(),
	gameName: z.string(),
	punchline: z.string().nullish(),
	core: z.boolean(),
	profilePictureURL: z.string().nullish(),
	leagueSummoners: SummonerDbSchema.array(),
});
export type Member = z.infer<typeof MemberSchema>;

/**
 * Member without any accounts or similar
 */
export const MemberOnlySchema = z.object({
	name: z.string().nullish(),
	gameName: z.string(),
	punchline: z.string().nullish(),
	core: z.boolean(),
	profilePictureURL: z.string().nullish(),
});
export type MemberOnly = z.infer<typeof MemberSchema>;
