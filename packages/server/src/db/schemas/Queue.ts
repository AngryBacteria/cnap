import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const LEAGUE_QUEUES_TABLE = pgTable("league_queues", {
	queueId: integer().primaryKey(),
	description: varchar(),
	map: varchar().notNull(),
	notes: varchar(),
});
