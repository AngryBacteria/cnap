import { PgDialect } from "drizzle-orm/pg-core";
import { describe, expect, it } from "vitest";
import { getAllOnConflictColumns } from "./index.js";
import { LEAGUE_SUMMONERS_TABLE } from "./schemas/Summoner.js";

describe("Index DB", () => {
	describe("getAllOnConflictColumns", () => {
		const dialect = new PgDialect();

		it("should return all columns except the excluded one", () => {
			const excludedKey = "puuid";
			const result = getAllOnConflictColumns(
				LEAGUE_SUMMONERS_TABLE,
				excludedKey,
			);

			const keys = Object.keys(result);

			expect(keys).not.toContain(excludedKey);

			expect(keys).toContain("gameName");
			expect(keys).toContain("profileIconId");
			expect(keys).toContain("summonerLevel");
			expect(keys).toContain("tagLine");
			expect(keys).toContain("memberGameName");

			expect(keys.length).toBe(5);
		});

		it("should generate the correct SQL syntax for columns", () => {
			const result = getAllOnConflictColumns(LEAGUE_SUMMONERS_TABLE, "puuid");
			expect(result.gameName).toBeDefined();
			if (!result.gameName) {
				throw new Error("gameName column was not found in result");
			}

			const gameNameGenerated = dialect.sqlToQuery(result.gameName);
			expect(gameNameGenerated.sql).toBe('excluded."gameName"');
		});

		it("should work when excluding a different column", () => {
			const result = getAllOnConflictColumns(
				LEAGUE_SUMMONERS_TABLE,
				"gameName",
			);
			const keys = Object.keys(result);

			expect(keys).not.toContain("gameName");
			expect(keys).toContain("puuid");

			if (!result.puuid) {
				throw new Error("puuid column was not found in result");
			}

			const puuidGenerated = dialect.sqlToQuery(result.puuid);
			expect(puuidGenerated.sql).toBe('excluded."puuid"');
		});
	});
});
