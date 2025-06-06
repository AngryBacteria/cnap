import { ObjectId } from "mongodb";
import { z } from "zod";
import { MongoDBIDSchema } from "./Database.js";
import { MemberDBSchema } from "./Member.js";

//TODO what to use for ID?
export const PenAndPaperCharacterDBSchema = z.object({
	_id: MongoDBIDSchema,
	name: z.string(),
	memberId: z.instanceof(ObjectId),
	imageUrls: z.string().array(),
});

export const PenAndPaperCharacterSchema = PenAndPaperCharacterDBSchema.omit({
	memberId: true,
}).extend({
	member: MemberDBSchema,
});

//TODO what to use for ID?
export const PenAndPaperSessionDBSchema = z.object({
	_id: MongoDBIDSchema,
	framework: z.string(),
	dmMemberId: z.instanceof(ObjectId),
	characterMemberIds: z.instanceof(ObjectId).array(),
	timestamp: z.number(),
	sessionName: z.string(),
	campaign: z.string(),
	summaryLong: z.string(),
	summaryShort: z.string(),
	goals: z.string().array(),
	transcriptions: z.string().array(),
	audioFileUrls: z.string().array(),
});

export const PenAndPaperSessionSchema = PenAndPaperSessionDBSchema.omit({
	dmMemberId: true,
	characterMemberIds: true,
}).extend({
	dm: MemberDBSchema,
	characters: PenAndPaperCharacterSchema.array(),
});
