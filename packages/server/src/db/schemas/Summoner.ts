import { relations } from "drizzle-orm";
import { integer, varchar } from "drizzle-orm/pg-core";
import { MEMBERS_TABLE } from "./Member.js";
import { LEAGUE_SCHEMA } from "./PGSchemas.js";

export const LEAGUE_SUMMONERS_TABLE = LEAGUE_SCHEMA.table("summoners", {
	puuid: varchar().primaryKey().notNull(),
	gameName: varchar().notNull(),
	profileIconId: integer().notNull(),
	summonerLevel: integer().notNull(),
	tagLine: varchar().notNull(),
	memberGameName: varchar()
		.references(() => MEMBERS_TABLE.gameName, { onDelete: "cascade" })
		.notNull(),
});

export const leagueSummonersRelations = relations(
	LEAGUE_SUMMONERS_TABLE,
	({ one }) => ({
		member: one(MEMBERS_TABLE, {
			fields: [LEAGUE_SUMMONERS_TABLE.memberGameName],
			references: [MEMBERS_TABLE.gameName],
		}),
	}),
);
