import { integer, varchar } from "drizzle-orm/pg-core";
import { LEAGUE_SCHEMA } from "./PGSchemas.js";

export const LEAGUE_QUEUES_TABLE = LEAGUE_SCHEMA.table("queues", {
	queueId: integer().primaryKey(),
	description: varchar(),
	map: varchar().notNull(),
	notes: varchar(),
});
