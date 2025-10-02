import { z } from "zod/v4";

export const AccountDBSchema = z.object({
	puuid: z.string(),
	gameName: z.string(),
	tagLine: z.string(),
});

export type AccountDB = z.infer<typeof AccountDBSchema>;
