import { integer, varchar } from "drizzle-orm/pg-core";
import { LEAGUE_SCHEMA } from "./PGSchemas.js";

export const LEAGUE_MAPS_TABLE = LEAGUE_SCHEMA.table("maps", {
	mapId: integer().primaryKey(),
	mapName: varchar().notNull(),
	notes: varchar().notNull(),
});
