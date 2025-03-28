import { z } from "zod";
import { SummonerDbSchema } from "./Summoner.js";

export const MemberSchema = z.object({
	name: z.string().nullish(),
	gameName: z.string(),
	punchline: z.string().nullish(),
	core: z.boolean(),
	profilePictureURL: z.string().nullish(),
});
export type Member = z.infer<typeof MemberSchema>;

export const MemberWithSummonerSchema = MemberSchema.extend({
	leagueSummoners: SummonerDbSchema.array(),
});
export type MemberWithSummoner = z.infer<typeof MemberSchema>;
