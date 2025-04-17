import { describe, expect, test } from "vitest";
import { CollectionName } from "../model/Database.js";
import dbh from "./DBHelper.js";

const allCollections = Object.values(CollectionName) as CollectionName[];

describe("DBHelper", () => {
	test("testConnection", async () => {
		const connection = await dbh.testConnection();
		expect(connection).toBeDefined();
		expect(connection).toBeTruthy();
	});

	test("getCollection", async () => {
		for (const name of allCollections) {
			const collection = dbh.getCollection(name);
			expect(collection).toBeDefined();
			expect(collection.collectionName).toBe(name);
		}
	});

	describe("genericGet", () => {
		test("genericGet without validator", async () => {
			for (const name of allCollections) {
				const response = await dbh.genericGet(name);
				expect(response.success).toBeTruthy();
				expect(response.data).toBeDefined();
				expect(response.data.length).toBeGreaterThan(0);
				expect(response.error).toBeUndefined();
			}
		});

		test("genericGet limit option", async () => {
			const response1 = await dbh.genericGet(CollectionName.SUMMONER, {
				limit: 3,
			});
			expect(response1.success).toBeTruthy();
			expect(response1.data).toBeDefined();
			expect(response1.data.length).toBe(3);
			expect(response1.error).toBeUndefined();

			const response2 = await dbh.genericGet(CollectionName.SUMMONER, {
				limit: 2,
			});
			expect(response2.success).toBeTruthy();
			expect(response2.data).toBeDefined();
			expect(response2.data.length).toBe(2);
			expect(response2.error).toBeUndefined();
		});

		test("genericGet offset option", async () => {
			const response1 = await dbh.genericGet(CollectionName.SUMMONER, {
				offset: 10,
			});
			expect(response1.success).toBeTruthy();
			expect(response1.data).toBeDefined();
			expect(response1.error).toBeUndefined();

			const response2 = await dbh.genericGet(CollectionName.SUMMONER, {
				offset: 1,
			});
			expect(response2.success).toBeTruthy();
			expect(response2.data).toBeDefined();
			expect(response2.error).toBeUndefined();

			expect(response1.data[0]).not.toBe(response2.data[0]);
		});
	});

	test("disconnect", async () => {
		const connection = await dbh.disconnect();
		expect(connection).toBeDefined();
		expect(connection).toBeTruthy();
	});
});
