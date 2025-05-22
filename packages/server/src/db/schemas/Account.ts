import { pgTable, varchar } from "drizzle-orm/pg-core";

export const RIOT_ACCOUNTS_TABLE = pgTable("riot_accounts", {
	puuid: varchar().primaryKey().notNull(),
	gameName: varchar().notNull().unique(),
	tagLine: varchar().notNull(),
});
