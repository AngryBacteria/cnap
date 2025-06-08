import { relations } from "drizzle-orm";
import {
	bigint,
	boolean,
	integer,
	jsonb,
	uniqueIndex,
	varchar,
} from "drizzle-orm/pg-core";
import { LEAGUE_CHAMPIONS_TABLE } from "./Champion.js";
import { LEAGUE_GAME_MODES_TABLE } from "./GameMode.js";
import { LEAGUE_ITEMS_TABLE } from "./Item.js";
import { LEAGUE_MAPS_TABLE } from "./LeagueMap.js";
import { LEAGUE_SCHEMA } from "./PGSchemas.js";
import { LEAGUE_QUEUES_TABLE } from "./Queue.js";
import { LEAGUE_SUMMONER_SPELLS_TABLE } from "./SummonerSpell.js";

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

export const LEAGUE_TIMELINES_TABLE = LEAGUE_SCHEMA.table("timelines", {
	matchId: varchar().primaryKey(),
	dataVersion: varchar().notNull(),
	raw: jsonb().notNull(),
});
export const leagueTimelineRelations = relations(
	LEAGUE_TIMELINES_TABLE,
	({ many }) => ({
		match: many(LEAGUE_MATCHES_TABLE),
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
		queueId: integer().references(() => LEAGUE_QUEUES_TABLE.queueId),
		gameMode: varchar().references(() => LEAGUE_GAME_MODES_TABLE.gameMode),
		mapId: integer().references(() => LEAGUE_MAPS_TABLE.mapId),
		championId: integer().references(() => LEAGUE_CHAMPIONS_TABLE.id),
		item0: integer().references(() => LEAGUE_ITEMS_TABLE.id),
		item1: integer().references(() => LEAGUE_ITEMS_TABLE.id),
		item2: integer().references(() => LEAGUE_ITEMS_TABLE.id),
		item3: integer().references(() => LEAGUE_ITEMS_TABLE.id),
		item4: integer().references(() => LEAGUE_ITEMS_TABLE.id),
		item5: integer().references(() => LEAGUE_ITEMS_TABLE.id),
		summoner1Id: integer().references(() => LEAGUE_SUMMONER_SPELLS_TABLE.id),
		summoner2Id: integer().references(() => LEAGUE_SUMMONER_SPELLS_TABLE.id),
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
		timeline: one(LEAGUE_TIMELINES_TABLE, {
			fields: [LEAGUE_MATCH_PARTICIPANTS_TABLE.matchId],
			references: [LEAGUE_TIMELINES_TABLE.matchId],
		}),
		champion: one(LEAGUE_CHAMPIONS_TABLE, {
			fields: [LEAGUE_MATCH_PARTICIPANTS_TABLE.championId],
			references: [LEAGUE_CHAMPIONS_TABLE.id],
		}),
		map: one(LEAGUE_MAPS_TABLE, {
			fields: [LEAGUE_MATCH_PARTICIPANTS_TABLE.mapId],
			references: [LEAGUE_MAPS_TABLE.mapId],
		}),
		queue: one(LEAGUE_QUEUES_TABLE, {
			fields: [LEAGUE_MATCH_PARTICIPANTS_TABLE.queueId],
			references: [LEAGUE_QUEUES_TABLE.queueId],
		}),
		gameMode: one(LEAGUE_GAME_MODES_TABLE, {
			fields: [LEAGUE_MATCH_PARTICIPANTS_TABLE.gameMode],
			references: [LEAGUE_GAME_MODES_TABLE.gameMode],
		}),
		summonerSpell1: one(LEAGUE_SUMMONER_SPELLS_TABLE, {
			fields: [LEAGUE_MATCH_PARTICIPANTS_TABLE.summoner1Id],
			references: [LEAGUE_SUMMONER_SPELLS_TABLE.id],
		}),
		summonerSpell2: one(LEAGUE_SUMMONER_SPELLS_TABLE, {
			fields: [LEAGUE_MATCH_PARTICIPANTS_TABLE.summoner2Id],
			references: [LEAGUE_SUMMONER_SPELLS_TABLE.id],
		}),
		item0: one(LEAGUE_ITEMS_TABLE, {
			fields: [LEAGUE_MATCH_PARTICIPANTS_TABLE.item0],
			references: [LEAGUE_ITEMS_TABLE.id],
		}),
		item1: one(LEAGUE_ITEMS_TABLE, {
			fields: [LEAGUE_MATCH_PARTICIPANTS_TABLE.item1],
			references: [LEAGUE_ITEMS_TABLE.id],
		}),
		item2: one(LEAGUE_ITEMS_TABLE, {
			fields: [LEAGUE_MATCH_PARTICIPANTS_TABLE.item2],
			references: [LEAGUE_ITEMS_TABLE.id],
		}),
		item3: one(LEAGUE_ITEMS_TABLE, {
			fields: [LEAGUE_MATCH_PARTICIPANTS_TABLE.item3],
			references: [LEAGUE_ITEMS_TABLE.id],
		}),
		item4: one(LEAGUE_ITEMS_TABLE, {
			fields: [LEAGUE_MATCH_PARTICIPANTS_TABLE.item4],
			references: [LEAGUE_ITEMS_TABLE.id],
		}),
		item5: one(LEAGUE_ITEMS_TABLE, {
			fields: [LEAGUE_MATCH_PARTICIPANTS_TABLE.item5],
			references: [LEAGUE_ITEMS_TABLE.id],
		}),
	}),
);
