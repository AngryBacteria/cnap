import { bigint, integer, varchar } from "drizzle-orm/pg-core";
import { LEAGUE_SCHEMA } from "./PGSchemas.js";

export const LEAGUE_SUMMONER_SPELLS_TABLE = LEAGUE_SCHEMA.table(
	"summoner_spells",
	{
		id: bigint({ mode: "number" }).primaryKey(),
		cooldown: integer().notNull(),
		description: varchar().notNull(),
		iconPath: varchar().notNull(),
		name: varchar().notNull(),
		summonerLevel: integer().notNull(),
	},
);
