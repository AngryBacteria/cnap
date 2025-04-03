import { ObjectId } from "mongodb";
import { z } from "zod";
import { MemberDBSchema } from "./Member.js";

export const PenAndPaperSessionDBSchema = z.object({
	timestamp: z.number(),
	sessionName: z.string(),
	dmId: z.instanceof(ObjectId),
	playerIds: z.instanceof(ObjectId).array(),
	campaign: z.string(),
	summaryLong: z.string(),
	summaryShort: z.string(),
	transcriptions: z.string().array(),
	audioFiles: z.string().array(),
});
export type PenAndPaperSessionDB = z.infer<typeof PenAndPaperSessionDBSchema>;

export const PenAndPaperSessionSchema = z.object({
	timestamp: z.number(),
	sessionName: z.string(),
	dm: MemberDBSchema,
	players: MemberDBSchema.array(),
	campaign: z.string(),
	summaryLong: z.string(),
	summaryShort: z.string(),
	transcriptions: z.string().array(),
	audioFiles: z.string().array(),
});
export type PenAndPaperSession = z.infer<typeof PenAndPaperSessionSchema>;
