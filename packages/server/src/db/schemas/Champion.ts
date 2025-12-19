import { defineRelations } from "drizzle-orm";
import {
	boolean,
	integer,
	real,
	serial,
	unique,
	varchar,
} from "drizzle-orm/pg-core";
import { LEAGUE_SCHEMA } from "./PGSchemas.js";

export const LEAGUE_CHAMPIONS_TABLE = LEAGUE_SCHEMA.table("champions", {
	id: integer().notNull().primaryKey(),
	alias: varchar().notNull(),
	name: varchar().notNull(),
	roles: varchar().array().notNull(),
	shortBio: varchar().notNull(),
	squarePortraitPath: varchar().notNull(),
	title: varchar().notNull(),
	uncenteredSplashPath: varchar(),
});

export const LEAGUE_CHAMPION_PLAYSTYLES_TABLE = LEAGUE_SCHEMA.table(
	"champion_playstyles",
	{
		championId: integer()
			.references(() => LEAGUE_CHAMPIONS_TABLE.id, { onDelete: "cascade" })
			.notNull()
			.primaryKey(),
		damage: integer().notNull(),
		durability: integer().notNull(),
		crowdControl: integer().notNull(),
		mobility: integer().notNull(),
		utility: integer().notNull(),
	},
);

export const LEAGUE_CHAMPION_TACTICAL_INFO_TABLE = LEAGUE_SCHEMA.table(
	"champion_tactical_info",
	{
		championId: integer()
			.references(() => LEAGUE_CHAMPIONS_TABLE.id, { onDelete: "cascade" })
			.notNull()
			.primaryKey(),
		style: integer().notNull(),
		difficulty: integer().notNull(),
		damageType: varchar().notNull(),
	},
);

export const LEAGUE_CHAMPION_SKINS_TABLE = LEAGUE_SCHEMA.table(
	"champion_skins",
	{
		id: integer().primaryKey(),
		championId: integer()
			.references(() => LEAGUE_CHAMPIONS_TABLE.id, { onDelete: "cascade" })
			.notNull(),
		isBase: boolean().notNull(),
		name: varchar().notNull(),
		splashPath: varchar().notNull(),
		uncenteredSplashPath: varchar().notNull(),
		tilePath: varchar().notNull(),
		loadScreenPath: varchar().notNull(),
		loadScreenVintagePath: varchar(),
		skinType: varchar().notNull(),
		rarity: varchar().notNull(),
		isLegacy: boolean().notNull(),
		splashVideoPath: varchar(),
		featuresText: varchar(),
		description: varchar(),
	},
);

export const LEAGUE_CHAMPION_PASSIVES_TABLE = LEAGUE_SCHEMA.table(
	"champion_passives",
	{
		championId: integer()
			.references(() => LEAGUE_CHAMPIONS_TABLE.id, { onDelete: "cascade" })
			.notNull()
			.primaryKey(),
		name: varchar().notNull(),
		abilityIconPath: varchar().notNull(),
		abilityVideoPath: varchar().notNull(),
		abilityVideoImagePath: varchar().notNull(),
		description: varchar().notNull(),
	},
);

export const LEAGUE_CHAMPION_SPELLS_TABLE = LEAGUE_SCHEMA.table(
	"champion_spells",
	{
		id: serial().primaryKey(),
		championId: integer()
			.references(() => LEAGUE_CHAMPIONS_TABLE.id, { onDelete: "cascade" })
			.notNull(),
		name: varchar().notNull(),
		abilityIconPath: varchar().notNull(),
		abilityVideoPath: varchar().notNull(),
		abilityVideoImagePath: varchar().notNull(),
		cost: varchar().notNull(),
		cooldown: varchar().notNull(),
		description: varchar().notNull(),
		dynamicDescription: varchar().notNull(),
		range: real().array().notNull(),
		costCoefficients: real().array().notNull(),
		cooldownCoefficients: real().array().notNull(),
		spellKey: varchar().notNull(),
	},
	(t) => [unique().on(t.championId, t.spellKey)],
);

export const championRelations = defineRelations(
	{
		LEAGUE_CHAMPIONS_TABLE,
		LEAGUE_CHAMPION_PASSIVES_TABLE,
		LEAGUE_CHAMPION_PLAYSTYLES_TABLE,
		LEAGUE_CHAMPION_SKINS_TABLE,
		LEAGUE_CHAMPION_SPELLS_TABLE,
		LEAGUE_CHAMPION_TACTICAL_INFO_TABLE,
	},
	(r) => ({
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
	}),
);
