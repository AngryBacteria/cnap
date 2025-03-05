import { z } from "zod";

export const PaginatedDBResponseSchema = z
	.object({
		data: z.unknown(),
		metadata: z
			.object({
				total: z.number(),
			})
			.array()
			.min(1),
	})
	.array()
	.min(1);

export type PaginatedDBResponse = z.infer<typeof PaginatedDBResponseSchema>;
