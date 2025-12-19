import { boolean, varchar } from "drizzle-orm/pg-core";
import { CORE_SCHEMA } from "./PGSchemas.js";

export const MEMBERS_TABLE = CORE_SCHEMA.table("members", {
	gameName: varchar().primaryKey(),
	punchline: varchar(),
	core: boolean().notNull(),
	profilePictureBase64: varchar(),
	profilePictureMimeType: varchar(),
});
