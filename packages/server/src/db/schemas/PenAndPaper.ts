import { integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { MEMBERS_TABLE } from "./Member.js";

export const PEN_AND_PAPER_CHARACTER_TABLE = pgTable(
	"pen_and_paper_characters",
	{
		id: serial().primaryKey(),
		name: varchar().notNull(),
		memberGameName: varchar()
			.notNull()
			.references(() => MEMBERS_TABLE.gameName),
		imageUrls: varchar().array().notNull(),
	},
);

export const PEN_AND_PAPER_SESSION_TABLE = pgTable("pen_and_paper_sessions", {
	id: serial().primaryKey(),
	framework: varchar().notNull(),
	dmMemberGameName: varchar()
		.notNull()
		.references(() => MEMBERS_TABLE.gameName),
	timestamp: integer().notNull(),
	sessionName: varchar().notNull(),
	campaign: varchar("campaign"),
	summaryLong: varchar("summary_long"),
	summaryShort: varchar("summary_short"),
	goals: varchar().array().notNull().notNull(),
	transcriptions: varchar().array().notNull().notNull(),
	audioFileUrls: varchar().array().notNull().notNull(),
});
