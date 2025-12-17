import { varchar } from "drizzle-orm/pg-core";
import { LEAGUE_SCHEMA } from "./PGSchemas.js";

export const LEAGUE_GAME_MODES_TABLE = LEAGUE_SCHEMA.table("game_modes", {
	gameMode: varchar().primaryKey(),
	description: varchar().notNull(),
});
