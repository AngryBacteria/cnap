import { boolean, integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const LEAGUE_SUMMONER_ICONS_TABLE = pgTable(
	"league_summoner_icons_table",
	{
		id: integer().primaryKey(),
		imagePath: varchar(),
		isLegacy: boolean().notNull(),
		title: varchar().notNull(),
		yearReleased: integer().notNull(),
	},
);
