import { relations } from "drizzle-orm";
import {
	bigint,
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
export const leagueMatchRelations = relations(
	LEAGUE_MATCHES_TABLE,
	({ many }) => ({
		matchParticipants: many(LEAGUE_MATCH_PARTICIPANTS_TABLE),
	}),
);

export const LEAGUE_MATCH_PARTICIPANTS_TABLE = LEAGUE_SCHEMA.table(
	"match_participants",
	{
		// Identifiers
		matchId: varchar()
			.references(() => LEAGUE_MATCHES_TABLE.matchId, { onDelete: "cascade" })
			.notNull(),
		puuid: varchar().notNull(),
		// Referenced data
		queueId: integer().notNull(),
		gameMode: varchar().notNull(),
		mapId: integer().notNull(),
		championId: integer().notNull(),
		item0: integer().notNull(),
		item1: integer().notNull(),
		item2: integer().notNull(),
		item3: integer().notNull(),
		item4: integer().notNull(),
		item5: integer().notNull(),
		item6: integer().notNull(),
		summoner1Id: integer().notNull(),
		summoner2Id: integer().notNull(),
		// Game data
		gameDuration: integer().notNull(),
		endOfGameResult: varchar(),
		gameCreation: bigint({ mode: "number" }).notNull(),
		gameType: varchar().notNull(),
		gameVersion: varchar().notNull(),
		platformId: varchar().notNull(),
		gameEndedInEarlySurrender: boolean().notNull(),
		gameEndedInSurrender: boolean().notNull(),
		// Participant data
		summonerName: varchar().notNull(),
		riotIdGameName: varchar(),
		riotIdTagline: varchar().notNull(),
		individualPosition: varchar().notNull(),
		teamPosition: varchar().notNull(),
		lane: varchar().notNull(),
		kills: integer().notNull(),
		deaths: integer().notNull(),
		assists: integer().notNull(),
		doubleKills: integer().notNull(),
		tripleKills: integer().notNull(),
		quadraKills: integer().notNull(),
		pentaKills: integer().notNull(),
		visionScore: integer().notNull(),
		win: boolean().notNull(),
		totalMinionsKilled: integer().notNull(),
	},
	(table) => [
		uniqueIndex("matchid-puuid-index").on(table.matchId, table.puuid),
	],
);

export const leagueMatchParticipantRelations = relations(
	LEAGUE_MATCH_PARTICIPANTS_TABLE,
	({ one }) => ({
		match: one(LEAGUE_MATCHES_TABLE, {
			fields: [LEAGUE_MATCH_PARTICIPANTS_TABLE.matchId],
			references: [LEAGUE_MATCHES_TABLE.matchId],
		}),
	}),
);
