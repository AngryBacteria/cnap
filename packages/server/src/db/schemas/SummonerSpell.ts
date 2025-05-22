import { bigint, integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const LEAGUE_SUMMONER_SPELLS_TABLE = pgTable("league_summoner_spells", {
	id: bigint({ mode: "number" }).primaryKey(),
	cooldown: integer().notNull(),
	description: varchar().notNull(),
	iconPath: varchar().notNull(),
	name: varchar().notNull(),
	summonerLevel: integer().notNull(),
});
