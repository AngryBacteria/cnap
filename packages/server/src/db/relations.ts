import { defineRelations } from "drizzle-orm";
import * as schema from "../db/schemas/index.js";

export const dbRelations = defineRelations(schema, (r) => ({
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
	MEMBERS_TABLE: {
		leagueSummoners: r.many.LEAGUE_SUMMONERS_TABLE({
			from: r.MEMBERS_TABLE.gameName,
			to: r.LEAGUE_SUMMONERS_TABLE.memberGameName,
		}),
	},
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
