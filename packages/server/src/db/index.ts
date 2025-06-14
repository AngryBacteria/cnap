import { type SQL, getTableColumns, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { type PgTable, customType } from "drizzle-orm/pg-core";
import { DB_URL } from "../helpers/EnvironmentConfig.js";
import logger from "../helpers/Logger.js";
import * as schema from "./schemas/index.js";

export const db = drizzle({
	connection: {
		connectionString: DB_URL,
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

type MissingParticipant = {
	matchId: string;
	puuid: string;
};

export async function getMissingParticipants() {
	const query = sql`
		SELECT DISTINCT
			m."matchId",
			(p ->> 'puuid') AS puuid
		FROM
			league.matches AS m,
			jsonb_array_elements(m.raw -> 'info' -> 'participants') AS p
		WHERE (p ->> 'puuid') <> 'BOT' AND NOT EXISTS (
			SELECT 1
			FROM league.match_participants AS mp
			WHERE mp."matchId" = m."matchId" AND mp.puuid = (p ->> 'puuid')
		);
	`;

	const result = await db.execute(query);
	return result.rows as MissingParticipant[];
}

type MissingTimeline = {
	matchId: string;
};

export async function getMissingTimelines() {
	const query = sql`
		SELECT DISTINCT
			m."matchId"
		FROM
			league.matches AS m,
			jsonb_array_elements(m.raw -> 'info' -> 'participants') AS p
		WHERE
			(p ->> 'puuid') <> 'BOT'
		  AND NOT EXISTS (
			SELECT
				1
			FROM
				league.timelines AS mp
			WHERE
				mp."matchId" = m."matchId"
		)
	`;

	const result = await db.execute(query);
	return result.rows as MissingTimeline[];
}
