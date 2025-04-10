import { z } from "zod";
import { MongoDBIDSchema } from "./Database.js";

export const GameTypeDBSchema = z.object({
	_id: MongoDBIDSchema,
	gametype: z.string(),
	description: z.string(),
});

export type GameTypeDB = z.infer<typeof GameTypeDBSchema>;
