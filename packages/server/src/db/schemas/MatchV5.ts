import {
	boolean,
	integer,
	jsonb,
	pgTable,
	uniqueIndex,
	varchar,
} from "drizzle-orm/pg-core";
import { LEAGUE_CHAMPIONS_TABLE } from "./Champion.js";
import { LEAGUE_GAME_MODES_TABLE } from "./GameMode.js";
import { LEAGUE_MAPS_TABLE } from "./LeagueMap.js";
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
		queueId: integer()
			.notNull()
			.references(() => LEAGUE_QUEUES_TABLE.queueId),
		gameMode: varchar()
			.notNull()
			.references(() => LEAGUE_GAME_MODES_TABLE.gameMode),
		mapId: integer()
			.notNull()
			.references(() => LEAGUE_MAPS_TABLE.mapId),
		gameDuration: integer().notNull(),

		puuid: varchar().notNull(),
		championId: integer()
			.notNull()
			.references(() => LEAGUE_CHAMPIONS_TABLE.id),
		teamPosition: varchar().notNull(),
		win: boolean().notNull(),
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
