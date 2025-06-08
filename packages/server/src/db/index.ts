import "dotenv/config";
import { type SQL, getTableColumns, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import type { PgTable } from "drizzle-orm/pg-core";
import { customType } from "drizzle-orm/pg-core";
import logger from "../helpers/Logger.js";
import * as schema from "./schemas/index.js";

export const db = drizzle({
	connection: {
		connectionString: process.env.DATABASE_URL,
		ssl: false, // TODO
	},
	schema,
});

export const bytea = customType<{
	data: Buffer;
	driverData: Buffer;
	config: never;
}>({
	dataType() {
		return "bytea";
	},
	toDriver(value) {
		return value;
	},
	fromDriver(value) {
		return value;
	},
});

export async function testDBConnection() {
	try {
		const dbResult = await db.query.MEMBERS_TABLE.findFirst();
		if (dbResult) {
			logger.debug("testDBConnection: Connection successful");
			return true;
		}
		logger.error(
			"testDBConnection: Database connection failed, no data returned",
		);
		return false;
	} catch (e) {
		logger.error(
			{ err: e },
			"testDBConnection: Database connection failed, error occurred",
		);
		return false;
	}
}

export const getAllOnConflictColumns = <
	T extends PgTable,
	Q extends keyof T["_"]["columns"],
>(
	table: T,
	excludeColumn: Q,
) => {
	const cls = getTableColumns(table);

	return Object.entries(cls).reduce(
		(acc, [columnKey, column]) => {
			if (columnKey !== excludeColumn) {
				acc[columnKey] = sql.raw(`excluded."${column.name}"`);
			}
			return acc;
		},
		{} as Record<string, SQL>,
	);
};
