import { z } from "zod";
import { MongoDBIDSchema } from "./Database.js";

export const GameModeDBSchema = z.object({
	_id: MongoDBIDSchema,
	gameMode: z.string(),
	description: z.string(),
});

export type GameModeDB = z.infer<typeof GameModeDBSchema>;
