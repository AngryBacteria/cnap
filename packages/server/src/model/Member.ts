import { z } from "zod";
import { SummonerDbSchema } from "./Summoner.js";

export const MemberDBSchema = z.object({
	gameName: z.string(),
	punchline: z.string().nullish(),
	core: z.boolean(),
	profilePictureURL: z.string().nullish(),
});
export type MemberDB = z.infer<typeof MemberDBSchema>;

export const MemberWithSummonerSchema = MemberDBSchema.extend({
	leagueSummoners: SummonerDbSchema.array(),
});
export type MemberWithSummoner = z.infer<typeof MemberDBSchema>;
