import { bigint, integer, serial, varchar } from "drizzle-orm/pg-core";
import { MEMBERS_TABLE } from "./Member.js";
import { PNP_SCHEMA } from "./PGSchemas.js";

export const PEN_AND_PAPER_CHARACTER_TABLE = PNP_SCHEMA.table("characters", {
	id: serial().primaryKey(),
	name: varchar().notNull(),
	memberGameName: varchar()
		.notNull()
		.references(() => MEMBERS_TABLE.gameName, { onDelete: "cascade" }),
	imageUrls: varchar().array().notNull(),
});

export const PEN_AND_PAPER_SESSION_TABLE = PNP_SCHEMA.table("sessions", {
	id: serial().primaryKey(),
	framework: varchar().notNull(),
	dmMemberGameName: varchar().references(() => MEMBERS_TABLE.gameName, {
		onDelete: "set null",
	}),
	timestamp: bigint({ mode: "number" }).notNull(),
	sessionName: varchar().notNull(),
	campaign: varchar("campaign"),
	summaryLong: varchar("summary_long"),
	summaryShort: varchar("summary_short"),
	goals: varchar().array().notNull().notNull(),
	transcriptions: varchar().array().notNull().notNull(),
	audioFileUrls: varchar().array().notNull().notNull(),
});

export const PEN_AND_PAPER_SESSION_CHARACTERS_TABLE = PNP_SCHEMA.table(
	"session_characters",
	{
		id: serial().primaryKey(),
		sessionId: integer()
			.notNull()
			.references(() => PEN_AND_PAPER_SESSION_TABLE.id, {
				onDelete: "cascade",
			}),
		characterId: integer()
			.notNull()
			.references(() => PEN_AND_PAPER_CHARACTER_TABLE.id, {
				onDelete: "cascade",
			}),
	},
);
