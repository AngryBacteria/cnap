import { z } from "zod";
import { MongoDBIDSchema } from "./Database.js";

export const QueueDBSchema = z.object({
	_id: MongoDBIDSchema,
	queueId: z.number(),
	description: z.string().nullish(),
	map: z.string(),
	notes: z.string().nullish(),
});

export type QueueDB = z.infer<typeof QueueDBSchema>;
