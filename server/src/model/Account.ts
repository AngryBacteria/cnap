import { z } from "zod";

export const AccountSchema = z.object({
	puuid: z.string(),
	gameName: z.string(),
	tagLine: z.string(),
});

export type Account = z.infer<typeof AccountSchema>;
