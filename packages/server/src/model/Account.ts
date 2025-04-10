import { z } from "zod";
import { MongoDBIDSchema } from "./Database.js";

export const AccountDBSchema = z.object({
	_id: MongoDBIDSchema,
	puuid: z.string(),
	gameName: z.string(),
	tagLine: z.string(),
});

export type AccountDB = z.infer<typeof AccountDBSchema>;
