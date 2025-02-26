import { z } from "zod";

export const QueueSchema = z
	.object({
		queueId: z.number(),
		description: z.string().nullish(),
		map: z.string(),
		notes: z.string().nullish(),
	})
	.passthrough();
export type Queue = z.infer<typeof QueueSchema>;
