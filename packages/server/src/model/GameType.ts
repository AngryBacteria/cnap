import { z } from "zod";

export const GameTypeDBSchema = z.object({
	gametype: z.string(),
	description: z.string(),
});

export type GameTypeDB = z.infer<typeof GameTypeDBSchema>;
