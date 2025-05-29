import { boolean, integer, real, serial, varchar } from "drizzle-orm/pg-core";
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
		id: serial().primaryKey(),
		championId: integer()
			.references(() => LEAGUE_CHAMPIONS_TABLE.id, { onDelete: "cascade" })
			.notNull(),
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
		id: serial().primaryKey(),
		championId: integer()
			.references(() => LEAGUE_CHAMPIONS_TABLE.id, { onDelete: "cascade" })
			.notNull(),
		style: integer().notNull(),
		difficulty: integer().notNull(),
		damageType: varchar().notNull(),
	},
);

export const LEAGUE_CHAMPION_SKINS_TABLE = LEAGUE_SCHEMA.table(
	"champion_skins",
	{
		id: serial().primaryKey(),
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
	},
);

export const LEAGUE_CHAMPION_PASSIVES_TABLE = LEAGUE_SCHEMA.table(
	"champion_passives",
	{
		id: serial().primaryKey(),
		championId: integer()
			.references(() => LEAGUE_CHAMPIONS_TABLE.id, { onDelete: "cascade" })
			.notNull(),
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
	},
);
