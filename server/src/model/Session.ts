import { z } from "zod";
import { MemberSchema } from "./Member.js";

export const SessionSchema = z.object({
	timestamp: z.number(),
	sessionName: z.string(),
	dm: MemberSchema,
	players: MemberSchema.array(),
	campaign: z.string(),
	transcriptions: z.string().array(),
	summaries: z.string().array(),
	audioFiles: z.string().array(),
});
export type Session = z.infer<typeof SessionSchema>;
