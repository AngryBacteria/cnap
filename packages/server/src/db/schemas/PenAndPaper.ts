import { relations } from "drizzle-orm";
import {
	integer,
	pgEnum,
	serial,
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
export const characterRelations = relations(
	PEN_AND_PAPER_CHARACTER_TABLE,
	({ one, many }) => ({
		member: one(MEMBERS_TABLE, {
			fields: [PEN_AND_PAPER_CHARACTER_TABLE.memberGameName],
			references: [MEMBERS_TABLE.gameName],
		}),
		inSessions: many(PEN_AND_PAPER_SESSION_CHARACTERS_TABLE),
	}),
);

export const frameworkEnum = pgEnum("framework", ["SWN", "DND (2024)"]);

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
	transcriptions: varchar().array().notNull(),
	audioFileBase64: varchar(),
	audioFileMimeType: varchar(),
});

export const PEN_AND_PAPER_SESSION_TABLE_UPDATE_SCHEMA = createUpdateSchema(
	PEN_AND_PAPER_SESSION_TABLE,
);

export const sessionRelations = relations(
	PEN_AND_PAPER_SESSION_TABLE,
	({ one, many }) => ({
		dm: one(MEMBERS_TABLE, {
			fields: [PEN_AND_PAPER_SESSION_TABLE.dmMemberGameName],
			references: [MEMBERS_TABLE.gameName],
		}),
		characters: many(PEN_AND_PAPER_SESSION_CHARACTERS_TABLE),
	}),
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
export const sessionCharacterRelations = relations(
	PEN_AND_PAPER_SESSION_CHARACTERS_TABLE,
	({ one }) => ({
		session: one(PEN_AND_PAPER_SESSION_TABLE, {
			fields: [PEN_AND_PAPER_SESSION_CHARACTERS_TABLE.sessionId],
			references: [PEN_AND_PAPER_SESSION_TABLE.id],
		}),
		character: one(PEN_AND_PAPER_CHARACTER_TABLE, {
			fields: [PEN_AND_PAPER_SESSION_CHARACTERS_TABLE.characterId],
			references: [PEN_AND_PAPER_CHARACTER_TABLE.id],
		}),
	}),
);
