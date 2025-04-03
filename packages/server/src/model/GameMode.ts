import { z } from "zod";

export const GameModeDBSchema = z.object({
	gameMode: z.string(),
	description: z.string(),
});

export type GameModeDB = z.infer<typeof GameModeDBSchema>;
