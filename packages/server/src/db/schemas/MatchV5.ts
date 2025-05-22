import {
	boolean,
	integer,
	jsonb,
	pgTable,
	uniqueIndex,
	varchar,
} from "drizzle-orm/pg-core";
import { LEAGUE_CHAMPIONS_TABLE } from "./Champion.js";
import { LEAGUE_QUEUES_TABLE } from "./Queue.js";

export const LEAGUE_MATCHES_TABLE = pgTable("league_matches", {
	matchId: varchar().primaryKey(),
	dataVersion: integer().notNull(),
	raw: jsonb().notNull(),
});

export const LEAGUE_TIMELINES_TABLE = pgTable("league_timelines", {
	matchId: varchar().primaryKey(),
	dataVersion: integer().notNull(),
	raw: jsonb().notNull(),
});

export const LEAGUE_MATCH_PARTICIPANTS_TABLE = pgTable(
	"league_match_participants",
	{
		matchId: varchar().notNull(),
		puuid: varchar().notNull(),
		championId: integer()
			.notNull()
			.references(() => LEAGUE_CHAMPIONS_TABLE.id),
		queueId: integer()
			.notNull()
			.references(() => LEAGUE_QUEUES_TABLE.queueId),
		//TODO gamemode
		//TODO mapid
		teamPosition: varchar().notNull(),
		win: boolean().notNull(),
		gameDuration: integer().notNull(),
		kills: integer().notNull(),
		deaths: integer().notNull(),
		assists: integer().notNull(),
		doubleKills: integer().notNull(),
		tripleKills: integer().notNull(),
		quadraKills: integer().notNull(),
		pentaKills: integer().notNull(),
		visionScore: integer().notNull(),
	},
	(table) => [
		uniqueIndex("matchid-puuid-index").on(table.matchId, table.puuid),
	],
);
