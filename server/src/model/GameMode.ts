import { z } from "zod";

export const GameModeSchema = z.object({
	gameMode: z.string(),
	description: z.string(),
});

export type GameMode = z.infer<typeof GameModeSchema>;
