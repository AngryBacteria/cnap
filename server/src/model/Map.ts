import { z } from "zod";

export const LeagueMapSchema = z
	.object({
		mapId: z.number(),
		mapName: z.string(),
		notes: z.string(),
	})
	.passthrough();
export type LeagueMap = z.infer<typeof LeagueMapSchema>;
