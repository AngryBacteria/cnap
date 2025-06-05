import "dotenv/config";
import { type SQL, getTableColumns, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import type { PgTable } from "drizzle-orm/pg-core";
import { customType } from "drizzle-orm/pg-core";
import * as schema from "./schemas/index.js";

export const db = drizzle({
	connection: {
		connectionString: process.env.DATABASE_URL,
		ssl: false, // TODO
	},
	casing: "snake_case",
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

export const getOnConflictPossibleColumns = <
	T extends PgTable,
	Q extends keyof T["_"]["columns"],
>(
	table: T,
	columns: Q[],
) => {
	const cls = getTableColumns(table);

	return columns.reduce(
		(acc, column) => {
			if (cls[column]) {
				const colName = cls[column].name;
				acc[column] = sql.raw(`excluded.${colName}`);
				return acc;
			}
			return acc;
		},
		{} as Record<Q, SQL>,
	);
};

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
				acc[columnKey] = sql.raw(`excluded.${column.name}`);
			}
			return acc;
		},
		{} as Record<string, SQL>,
	);
};
