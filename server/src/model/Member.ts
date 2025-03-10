import { z } from "zod";
import { SummonerDbSchema } from "./Summoner.js";

export const MemberSchema = z.object({
	gameName: z.string(),
	//gameName: z.string(),
	//punchline: z.string(),
	core: z.boolean(),
	//affiliations: z.string().array(),
	leagueSummoners: SummonerDbSchema.array(),
});
export type Member = z.infer<typeof MemberSchema>;
