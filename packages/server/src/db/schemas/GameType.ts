import { varchar } from "drizzle-orm/pg-core";
import { LEAGUE_SCHEMA } from "./PGSchemas.js";

export const LEAGUE_GAME_TYPES_TABLE = LEAGUE_SCHEMA.table("game_types", {
	gametype: varchar().primaryKey(),
	description: varchar().notNull(),
});
