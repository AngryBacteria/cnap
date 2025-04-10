import { z } from "zod";
import { MongoDBIDSchema } from "./Database.js";

export const SummonerSpellDBSchema = z.object({
	_id: MongoDBIDSchema,
	id: z.number(),
	cooldown: z.number(),
	description: z.string(),
	gameModes: z.array(z.string()),
	iconPath: z.string(),
	name: z.string(),
	summonerLevel: z.number(),
});

export type SummonerSpellDB = z.infer<typeof SummonerSpellDBSchema>;
