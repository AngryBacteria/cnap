import { z } from "zod/v4";

export const SummonerSpellDBSchema = z.object({
	id: z.number(),
	cooldown: z.number(),
	description: z.string(),
	gameModes: z.array(z.string()),
	iconPath: z.string(),
	name: z.string(),
	summonerLevel: z.number(),
});

export type SummonerSpellDB = z.infer<typeof SummonerSpellDBSchema>;
