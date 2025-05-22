import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const LEAGUE_MAPS_TABLE = pgTable("league_maps", {
	mapId: integer().primaryKey(),
	mapName: varchar().notNull(),
	notes: varchar().notNull(),
});
