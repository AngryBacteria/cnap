import { relations } from "drizzle-orm";
import { boolean, varchar } from "drizzle-orm/pg-core";
import { CORE_SCHEMA } from "./PGSchemas.js";
import { PEN_AND_PAPER_CHARACTER_TABLE } from "./PenAndPaper.js";
import { LEAGUE_SUMMONERS_TABLE } from "./Summoner.js";

export const MEMBERS_TABLE = CORE_SCHEMA.table("members", {
	gameName: varchar().primaryKey(),
	punchline: varchar(),
	core: boolean().notNull(),
	profilePictureBase64: varchar(),
	profilePictureMimeType: varchar(),
});

export const membersRelations = relations(MEMBERS_TABLE, ({ many }) => ({
	leagueSummoners: many(LEAGUE_SUMMONERS_TABLE),
	pnpCharacters: many(PEN_AND_PAPER_CHARACTER_TABLE),
}));
