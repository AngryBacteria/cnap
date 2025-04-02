import { z } from "zod";

export const LeagueMapDBSchema = z.object({
	mapId: z.number(),
	mapName: z.string(),
	notes: z.string(),
});

export type LeagueMapDB = z.infer<typeof LeagueMapDBSchema>;
