import { boolean, pgTable, varchar } from "drizzle-orm/pg-core";

export const MEMBERS_TABLE = pgTable("members", {
	gameName: varchar().primaryKey(),
	punchline: varchar(),
	core: boolean().notNull(),
	profilePictureURL: varchar(),
});
