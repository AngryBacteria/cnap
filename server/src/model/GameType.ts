import { z } from "zod";

export const GameTypeSchema = z.object({
	gametype: z.string(),
	description: z.string(),
});
export type GameType = z.infer<typeof GameTypeSchema>;
