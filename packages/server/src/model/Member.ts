import { z } from "zod";
import { MongoDBIDSchema } from "./Database.js";
import { SummonerDbSchema } from "./Summoner.js";

//TODO what to use for ID?
export const MemberDBSchema = z.object({
	_id: MongoDBIDSchema,
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
