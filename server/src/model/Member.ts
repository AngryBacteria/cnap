import { z } from "zod";
import { SummonerDbSchema } from "./Summoner.js";

export const MemberSchema = z.object({
	name: z.string().nullish(),
	gameName: z.string(),
	punchline: z.string().nullish(),
	core: z.boolean(),
	pixelPictureURL: z.string().nullish(),
	//affiliations: z.string().array(),
	leagueSummoners: SummonerDbSchema.array(),
});
export type Member = z.infer<typeof MemberSchema>;
