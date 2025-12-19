import {
	integer,
	pgEnum,
	serial,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";
import { createUpdateSchema } from "drizzle-zod";
import { MEMBERS_TABLE } from "./Member.js";
import { PNP_SCHEMA } from "./PGSchemas.js";

export const PEN_AND_PAPER_CHARACTER_TABLE = PNP_SCHEMA.table("characters", {
	id: serial().primaryKey(),
	name: varchar().notNull(),
	memberGameName: varchar()
		.notNull()
		.references(() => MEMBERS_TABLE.gameName, { onDelete: "cascade" }),
});

export const frameworkEnum = pgEnum("framework", ["SWN", "DND (2024)"]);
export const statusEnum = pgEnum("session_status", [
	"draft",
	"valid",
	"deleted",
]);

export const PEN_AND_PAPER_SESSION_TABLE = PNP_SCHEMA.table("sessions", {
	id: serial().primaryKey(),
	framework: frameworkEnum().notNull(),
	dmMemberGameName: varchar()
		.references(() => MEMBERS_TABLE.gameName, {
			onDelete: "set null",
		})
		.notNull(),
	timestamp: timestamp({ withTimezone: true }).notNull(),
	sessionName: varchar().notNull(),
	campaign: varchar().notNull(),
	summaryLong: varchar().notNull(),
	summaryShort: varchar().notNull(),
	goals: varchar().array().notNull().notNull(),
	transcription: text(),
	audioFileBase64: varchar(),
	audioFileMimeType: varchar(),
	status: statusEnum().notNull(),
});

export const PEN_AND_PAPER_SESSION_TABLE_UPDATE_SCHEMA = createUpdateSchema(
	PEN_AND_PAPER_SESSION_TABLE,
);

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
