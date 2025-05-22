import { boolean, integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const LEAGUE_ITEMS_TABLE = pgTable("league_items", {
	id: integer().primaryKey(),
	active: boolean().notNull(),
	categories: varchar().array().notNull(),
	description: varchar().notNull(),
	iconPath: varchar().notNull(),
	inStore: boolean().notNull(),
	isEnchantment: boolean().notNull(),
	maxStacks: integer().notNull(),
	name: varchar().notNull(),
	price: integer().notNull(),
	priceTotal: integer().notNull(),
	requiredAlly: varchar().notNull(),
	requiredChampion: varchar().notNull(),
});
