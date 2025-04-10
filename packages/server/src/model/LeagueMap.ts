import { z } from "zod";
import { MongoDBIDSchema } from "./Database.js";

export const LeagueMapDBSchema = z.object({
	_id: MongoDBIDSchema,
	mapId: z.number(),
	mapName: z.string(),
	notes: z.string(),
});

export type LeagueMapDB = z.infer<typeof LeagueMapDBSchema>;
