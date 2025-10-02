import { z } from "zod/v4";

export const LeagueMapDBSchema = z.object({
	mapId: z.number(),
	mapName: z.string(),
	notes: z.string(),
});

export type LeagueMapDB = z.infer<typeof LeagueMapDBSchema>;
