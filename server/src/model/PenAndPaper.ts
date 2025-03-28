import { z } from "zod";
import { MemberSchema } from "./Member.js";

export const PenAndPaperCharacterSchema = z.object({
	name: z.string(),
	characterClass: z.string().nullish(),
	player: MemberSchema,
	punchline: z.string(),
	backstory: z.string(),
	imageUrls: z.string().array(),
});
export type PenAndPaperCharacter = z.infer<typeof PenAndPaperCharacterSchema>;

export const PenAndPaperSessionSchema = z.object({
	timestamp: z.number(),
	sessionName: z.string(),
	dm: MemberSchema,
	players: MemberSchema.array(),
	characters: PenAndPaperCharacterSchema.array(),
	campaign: z.string(),
	transcriptions: z.string().array(),
	summaries: z.string().array(),
	audioFiles: z.string().array(),
});
export type PenAndPaperSession = z.infer<typeof PenAndPaperSessionSchema>;
