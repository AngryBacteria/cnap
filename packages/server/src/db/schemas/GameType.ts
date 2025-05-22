import { pgTable, varchar } from "drizzle-orm/pg-core";

export const LEAGUE_GAME_TYPES_TABLE = pgTable("league_game_types", {
	gametype: varchar().primaryKey(),
	description: varchar().notNull(),
});
