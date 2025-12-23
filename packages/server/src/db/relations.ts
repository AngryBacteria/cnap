import { defineRelations } from "drizzle-orm";
import * as schema from "../db/schemas/index.js";

export const dbRelations = defineRelations(schema, (r) => ({
	// lol
	LEAGUE_CHAMPIONS_TABLE: {
		passives: r.many.LEAGUE_CHAMPION_PASSIVES_TABLE({
			from: r.LEAGUE_CHAMPIONS_TABLE.id,
			to: r.LEAGUE_CHAMPION_PASSIVES_TABLE.championId,
		}),
		playstyle: r.one.LEAGUE_CHAMPION_PLAYSTYLES_TABLE({
			from: r.LEAGUE_CHAMPIONS_TABLE.id,
			to: r.LEAGUE_CHAMPION_PLAYSTYLES_TABLE.championId,
		}),
		skins: r.many.LEAGUE_CHAMPION_SKINS_TABLE({
			from: r.LEAGUE_CHAMPIONS_TABLE.id,
			to: r.LEAGUE_CHAMPION_SKINS_TABLE.championId,
		}),
		spells: r.many.LEAGUE_CHAMPION_SPELLS_TABLE({
			from: r.LEAGUE_CHAMPIONS_TABLE.id,
			to: r.LEAGUE_CHAMPION_SPELLS_TABLE.championId,
		}),
		tacticalInfo: r.one.LEAGUE_CHAMPION_TACTICAL_INFO_TABLE({
			from: r.LEAGUE_CHAMPIONS_TABLE.id,
			to: r.LEAGUE_CHAMPION_TACTICAL_INFO_TABLE.championId,
		}),
	},
	LEAGUE_MATCH_PARTICIPANTS_TABLE: {
		champion: r.one.LEAGUE_CHAMPIONS_TABLE({
			from: r.LEAGUE_MATCH_PARTICIPANTS_TABLE.championId,
			to: r.LEAGUE_CHAMPIONS_TABLE.id,
		}),
		queue: r.one.LEAGUE_QUEUES_TABLE({
			from: r.LEAGUE_MATCH_PARTICIPANTS_TABLE.queueId,
			to: r.LEAGUE_QUEUES_TABLE.queueId,
		}),
		gameModeDetails: r.one.LEAGUE_GAME_MODES_TABLE({
			from: r.LEAGUE_MATCH_PARTICIPANTS_TABLE.gameMode,
			to: r.LEAGUE_GAME_MODES_TABLE.gameMode,
		}),
		map: r.one.LEAGUE_MAPS_TABLE({
			from: r.LEAGUE_MATCH_PARTICIPANTS_TABLE.mapId,
			to: r.LEAGUE_MAPS_TABLE.mapId,
		}),
		summoner: r.one.LEAGUE_SUMMONERS_TABLE({
			from: r.LEAGUE_MATCH_PARTICIPANTS_TABLE.puuid,
			to: r.LEAGUE_SUMMONERS_TABLE.puuid,
		}),
		match: r.one.LEAGUE_MATCHES_TABLE({
			from: r.LEAGUE_MATCH_PARTICIPANTS_TABLE.matchId,
			to: r.LEAGUE_MATCHES_TABLE.matchId,
		}),
		summonerSpell1: r.one.LEAGUE_SUMMONER_SPELLS_TABLE({
			from: r.LEAGUE_MATCH_PARTICIPANTS_TABLE.summoner1Id,
			to: r.LEAGUE_SUMMONER_SPELLS_TABLE.id,
		}),
		summonerSpell2: r.one.LEAGUE_SUMMONER_SPELLS_TABLE({
			from: r.LEAGUE_MATCH_PARTICIPANTS_TABLE.summoner2Id,
			to: r.LEAGUE_SUMMONER_SPELLS_TABLE.id,
		}),
		item0Rel: r.one.LEAGUE_ITEMS_TABLE({
			from: r.LEAGUE_MATCH_PARTICIPANTS_TABLE.item0,
			to: r.LEAGUE_ITEMS_TABLE.id,
		}),
		item1Rel: r.one.LEAGUE_ITEMS_TABLE({
			from: r.LEAGUE_MATCH_PARTICIPANTS_TABLE.item1,
			to: r.LEAGUE_ITEMS_TABLE.id,
		}),
		item2Rel: r.one.LEAGUE_ITEMS_TABLE({
			from: r.LEAGUE_MATCH_PARTICIPANTS_TABLE.item2,
			to: r.LEAGUE_ITEMS_TABLE.id,
		}),
		item3Rel: r.one.LEAGUE_ITEMS_TABLE({
			from: r.LEAGUE_MATCH_PARTICIPANTS_TABLE.item3,
			to: r.LEAGUE_ITEMS_TABLE.id,
		}),
		item4Rel: r.one.LEAGUE_ITEMS_TABLE({
			from: r.LEAGUE_MATCH_PARTICIPANTS_TABLE.item4,
			to: r.LEAGUE_ITEMS_TABLE.id,
		}),
		item5Rel: r.one.LEAGUE_ITEMS_TABLE({
			from: r.LEAGUE_MATCH_PARTICIPANTS_TABLE.item5,
			to: r.LEAGUE_ITEMS_TABLE.id,
		}),
		item6Rel: r.one.LEAGUE_ITEMS_TABLE({
			from: r.LEAGUE_MATCH_PARTICIPANTS_TABLE.item6,
			to: r.LEAGUE_ITEMS_TABLE.id,
		}),
	},
	// core
	MEMBERS_TABLE: {
		leagueSummoners: r.many.LEAGUE_SUMMONERS_TABLE({
			from: r.MEMBERS_TABLE.gameName,
			to: r.LEAGUE_SUMMONERS_TABLE.memberGameName,
		}),
	},
	// pen and paper
	PEN_AND_PAPER_SESSION_TABLE: {
		dm: r.one.MEMBERS_TABLE({
			from: r.PEN_AND_PAPER_SESSION_TABLE.dmMemberGameName,
			to: r.MEMBERS_TABLE.gameName,
		}),
		characters: r.many.PEN_AND_PAPER_CHARACTER_TABLE({
			from: r.PEN_AND_PAPER_SESSION_TABLE.id.through(
				r.PEN_AND_PAPER_SESSION_CHARACTERS_TABLE.sessionId,
			),
			to: r.PEN_AND_PAPER_CHARACTER_TABLE.id.through(
				r.PEN_AND_PAPER_SESSION_CHARACTERS_TABLE.characterId,
			),
		}),
	},
	PEN_AND_PAPER_CHARACTER_TABLE: {
		member: r.one.MEMBERS_TABLE({
			from: r.PEN_AND_PAPER_CHARACTER_TABLE.memberGameName,
			to: r.MEMBERS_TABLE.gameName,
		}),
		sessions: r.many.PEN_AND_PAPER_SESSION_TABLE(),
	},
}));
