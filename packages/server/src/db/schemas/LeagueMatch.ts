import {
	boolean,
	integer,
	jsonb,
	uniqueIndex,
	varchar,
} from "drizzle-orm/pg-core";
import { LEAGUE_SCHEMA } from "./PGSchemas.js";

export const LEAGUE_MATCHES_TABLE = LEAGUE_SCHEMA.table("matches", {
	matchId: varchar().primaryKey(),
	dataVersion: varchar().notNull(),
	raw: jsonb().notNull(),
});

export const LEAGUE_TIMELINES_TABLE = LEAGUE_SCHEMA.table("timelines", {
	matchId: varchar().primaryKey(),
	dataVersion: integer().notNull(),
	raw: jsonb().notNull(),
});

export const LEAGUE_MATCH_PARTICIPANTS_TABLE = LEAGUE_SCHEMA.table(
	"match_participants",
	{
		matchId: varchar()
			.references(() => LEAGUE_MATCHES_TABLE.matchId, { onDelete: "cascade" })
			.notNull(),
		puuid: varchar().notNull(),

		queueId: integer().notNull(),
		//.references(() => LEAGUE_QUEUES_TABLE.queueId),
		gameMode: varchar().notNull(),
		//.references(() => LEAGUE_GAME_MODES_TABLE.gameMode),
		mapId: integer().notNull(),
		//.references(() => LEAGUE_MAPS_TABLE.mapId),
		gameDuration: integer().notNull(),
		championId: integer().notNull(),
		//.references(() => LEAGUE_CHAMPIONS_TABLE.id),
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
