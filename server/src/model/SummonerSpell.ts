import { z } from "zod";

export const SummonerSpellSchema = z.object({
	id: z.number(),
	cooldown: z.number(),
	description: z.string(),
	gameModes: z.array(z.string()),
	iconPath: z.string(),
	name: z.string(),
	summonerLevel: z.number(),
});
export type SummonerSpell = z.infer<typeof SummonerSpellSchema>;
