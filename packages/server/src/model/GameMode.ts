import { z } from "zod/v4";

export const GameModeDBSchema = z.object({
	gameMode: z.string(),
	description: z.string(),
});

export type GameModeDB = z.infer<typeof GameModeDBSchema>;
