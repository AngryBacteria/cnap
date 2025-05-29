import { relations } from "drizzle-orm";
import { boolean, varchar } from "drizzle-orm/pg-core";
import { CORE_SCHEMA } from "./PGSchemas.js";
import { LEAGUE_SUMMONERS_TABLE } from "./Summoner.js";

export const MEMBERS_TABLE = CORE_SCHEMA.table("members", {
	gameName: varchar().primaryKey(),
	punchline: varchar(),
	core: boolean().notNull(),
	profilePictureURL: varchar(),
});

export const membersRelations = relations(MEMBERS_TABLE, ({ many }) => ({
	leagueSummoners: many(LEAGUE_SUMMONERS_TABLE),
}));
