import { boolean, integer, varchar } from "drizzle-orm/pg-core";
import { LEAGUE_SCHEMA } from "./PGSchemas.js";

export const LEAGUE_SUMMONER_ICONS_TABLE = LEAGUE_SCHEMA.table(
	"summoner_icons_table",
	{
		id: integer().primaryKey(),
		imagePath: varchar(),
		isLegacy: boolean().notNull(),
		title: varchar().notNull(),
		yearReleased: integer().notNull(),
	},
);
