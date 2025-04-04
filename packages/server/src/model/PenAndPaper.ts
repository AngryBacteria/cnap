import { z } from "zod";

//TODO: add characters and dm

export const PenAndPaperSessionDBSchema = z.object({
	timestamp: z.number(),
	sessionName: z.string(),
	campaign: z.string(),
	summaryLong: z.string(),
	summaryShort: z.string(),
	goals: z.string().array(),
	transcriptions: z.string().array(),
	audioFileUrls: z.string().array(),
});
export type PenAndPaperSessionDB = z.infer<typeof PenAndPaperSessionDBSchema>;
