import { pgTable, varchar } from "drizzle-orm/pg-core";

export const LEAGUE_GAME_MODES_TABLE = pgTable("league_game_modes", {
	gameMode: varchar().primaryKey(),
	description: varchar().notNull(),
});
