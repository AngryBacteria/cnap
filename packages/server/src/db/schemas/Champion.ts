import {
	boolean,
	integer,
	pgTable,
	serial,
	varchar,
} from "drizzle-orm/pg-core";

export const LEAGUE_CHAMPIONS_TABLE = pgTable("league_champions", {
	id: integer().notNull().primaryKey(),
	alias: varchar().notNull(),
	name: varchar().notNull(),
	roles: varchar().array().notNull(),
	shortBio: varchar().notNull(),
	squarePortraitPath: varchar().notNull(),
	title: varchar().notNull(),
	uncenteredSplashPath: varchar(),
});

export const LEAGUE_CHAMPION_PLAYSTYLES_TABLE = pgTable(
	"league_champion_playstyles",
	{
		id: serial().primaryKey(),
		championId: integer()
			.references(() => LEAGUE_CHAMPIONS_TABLE.id)
			.notNull(),
		damage: integer().notNull(),
		durability: integer().notNull(),
		crowdControl: integer().notNull(),
		mobility: integer().notNull(),
		utility: integer().notNull(),
	},
);

export const LEAGUE_CHAMPION_TACTICAL_INFO_TABLE = pgTable(
	"league_champion_tactical_info",
	{
		id: serial().primaryKey(),
		championId: integer()
			.references(() => LEAGUE_CHAMPIONS_TABLE.id)
			.notNull(),
		style: integer().notNull(),
		difficulty: integer().notNull(),
		damageType: varchar().notNull(),
	},
);

export const LEAGUE_CHAMPION_SKINS_TABLE = pgTable("league_champion_skins", {
	id: serial().primaryKey(),
	championId: integer()
		.references(() => LEAGUE_CHAMPIONS_TABLE.id)
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
});

export const LEAGUE_CHAMPION_PASSIVES_TABLE = pgTable(
	"league_champion_passives",
	{
		id: serial().primaryKey(),
		championId: integer()
			.references(() => LEAGUE_CHAMPIONS_TABLE.id)
			.notNull(),
		name: varchar().notNull(),
		abilityIconPath: varchar().notNull(),
		abilityVideoPath: varchar().notNull(),
		abilityVideoImagePath: varchar().notNull(),
		description: varchar().notNull(),
	},
);

export const LEAGUE_CHAMPION_SPELLS_TABLE = pgTable("league_champion_spells", {
	id: serial().primaryKey(),
	championId: integer()
		.references(() => LEAGUE_CHAMPIONS_TABLE.id)
		.notNull(),
	name: varchar().notNull(),
	abilityIconPath: varchar().notNull(),
	abilityVideoPath: varchar().notNull(),
	abilityVideoImagePath: varchar().notNull(),
	cost: varchar().notNull(),
	cooldown: varchar().notNull(),
	description: varchar().notNull(),
	dynamicDescription: varchar().notNull(),
	range: integer().array().notNull(),
	costCoefficients: integer().array().notNull(),
	cooldownCoefficients: integer().array().notNull(),
});
