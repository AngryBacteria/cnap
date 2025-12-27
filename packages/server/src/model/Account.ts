import { z } from "zod/v4";

export const AccountRiotSchema = z.object({
	puuid: z.string(),
	gameName: z.string(),
	tagLine: z.string(),
});

export type AccountRiot = z.infer<typeof AccountRiotSchema>;
