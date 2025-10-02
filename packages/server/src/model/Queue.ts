import { z } from "zod/v4";

export const QueueDBSchema = z.object({
	queueId: z.number(),
	description: z.string().nullish(),
	map: z.string(),
	notes: z.string().nullish(),
});

export type QueueDB = z.infer<typeof QueueDBSchema>;
