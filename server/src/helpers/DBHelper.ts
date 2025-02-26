import "dotenv/config";
import { type Collection, type Db, MongoClient } from "mongodb";
import { z } from "zod";

export enum CollectionName {
	CHAMPION = "champion",
	GAME_MODE = "game_mode",
	GAME_TYPE = "game_type",
	ITEM = "item",
	MAP = "map",
	MATCH = "match_v5",
	QUEUE = "queue",
	SUMMONER = "summoner",
	SUMMONER_ICON = "summoner_icon",
	SUMMONER_SPELL = "summoner_spell",
	TIMELINE = "timeline_v5",
}

export const BasicFilterSchema = z.object({
	offset: z
		.number()
		.int()
		.nonnegative()
		.default(0)
		.describe("Number of items to skip"),
	limit: z
		.number()
		.int()
		.positive()
		.default(5)
		.describe("Maximum number of items to return"),
	project: z
		.record(z.string(), z.number())
		.default({ _id: 0 })
		.describe("Fields to return"),
	filter: z.record(z.string(), z.any()).default({}).describe("Filter to apply"),
});
export type BasicFilter = z.infer<typeof BasicFilterSchema>;

export class DBHelper {
	private mongoClient: MongoClient;
	private database: Db;

	constructor() {
		// Initialize MongoDB Connection
		const mongodbConnectionString = process.env.MONGODB_CONNECTION_STRING;
		if (!mongodbConnectionString) {
			throw new Error("No MongoDB Connection String found in Environment");
		}

		this.mongoClient = new MongoClient(mongodbConnectionString);
		this.database = this.mongoClient.db("cnap_test");
	}

	getCollection(name: CollectionName): Collection {
		return this.database.collection(name);
	}

	async disconnect(): Promise<void> {
		await this.mongoClient.close();
		console.log("Disconnected from MongoDB");
	}

	/**
	 * Test MongoDB connection by attempting to execute a simple command.
	 * Returns true if connection is successful, false otherwise.
	 */
	async testConnection(): Promise<boolean> {
		try {
			// Ping the database
			await this.database.command({ ping: 1 });
			console.log("Successfully connected to MongoDB");
			return true;
		} catch (error) {
			console.error(
				`MongoDB connection test failed. Review your connection string and internet connection: ${error}`,
			);
			return false;
		}
	}

	async initIndexes(): Promise<boolean> {
		try {
			await this.getCollection(CollectionName.SUMMONER).createIndex("puuid", {
				unique: true,
			});
			console.log("Created summoner indexes");

			await this.getCollection(CollectionName.MATCH).createIndex(
				"metadata.matchId",
				{ unique: true },
			);
			await this.getCollection(CollectionName.MATCH).createIndex(
				"metadata.participants",
				{ unique: false },
			);
			await this.getCollection(CollectionName.MATCH).createIndex(
				"info.participants.championId",
				{ unique: false },
			);
			console.log("Created match indexes");

			await this.getCollection(CollectionName.TIMELINE).createIndex(
				"metadata.matchId",
				{ unique: true },
			);
			await this.getCollection(CollectionName.TIMELINE).createIndex(
				"metadata.participants",
				{ unique: false },
			);
			console.log("Created timeline indexes");

			await this.getCollection(CollectionName.CHAMPION).createIndex("id", {
				unique: true,
			});
			await this.getCollection(CollectionName.GAME_MODE).createIndex(
				"gameMode",
				{ unique: true },
			);
			await this.getCollection(CollectionName.GAME_TYPE).createIndex(
				"gametype",
				{ unique: true },
			);
			await this.getCollection(CollectionName.ITEM).createIndex("id", {
				unique: true,
			});
			await this.getCollection(CollectionName.MAP).createIndex("mapId", {
				unique: true,
			});
			await this.getCollection(CollectionName.QUEUE).createIndex("queueId", {
				unique: true,
			});
			console.log("Created static data indexes");

			console.log("All indexes created successfully");
			return true;
		} catch (error) {
			console.error(`Error creating indexes: ${error}`);
			return false;
		}
	}

	async getNonExistingMatchIds(
		ids: string[],
		entityName: "MatchV5" | "TimelineV5",
		idField: string,
	): Promise<string[]> {
		try {
			if (!ids.length) {
				console.warn(
					"No ids provided, aborting operation and returning empty array",
				);
				return [];
			}

			const idsSet = new Set(ids);
			let existingIds: string[] = [];

			if (entityName === "MatchV5") {
				existingIds = await this.getCollection(CollectionName.MATCH).distinct(
					idField,
					{ [idField]: { $in: Array.from(idsSet) } },
				);
			} else {
				existingIds = await this.getCollection(
					CollectionName.TIMELINE,
				).distinct(idField, { [idField]: { $in: Array.from(idsSet) } });
			}

			const nonExistingIds = Array.from(idsSet).filter(
				(id) => !existingIds.includes(id),
			);
			console.log(
				`${existingIds.length} of ${idsSet.size} ${entityName} were already present in the database`,
			);
			return nonExistingIds;
		} catch (error) {
			console.error(
				`Error while checking for existing ${entityName.toLowerCase()} ids: ${error}`,
			);
			return [];
		}
	}

	/**
	 * Generic get method that can return raw data or validated data
	 */
	async genericGet<T>(
		baseFilter: BasicFilter,
		collectionName: CollectionName,
		validator?: z.ZodType<T>,
	): Promise<T[]> {
		try {
			const cursor = this.getCollection(collectionName)
				.find(baseFilter.filter, { projection: baseFilter.project })
				.skip(baseFilter.offset)
				.limit(baseFilter.limit);

			const dataRaw = await cursor.toArray();
			console.log(`Got ${dataRaw.length} ${collectionName} objects from DB`);

			if (validator) {
				// Use validator to parse and convert the data to type T
				return validator.array().parse(dataRaw);
			}
			return dataRaw as unknown as T[];
		} catch (error) {
			console.error(`Error getting data with MongoDB: ${error}`);
			return [];
		}
	}

	/**
	 * Generic upsert method that handles both raw data and zod validated data
	 */
	async genericUpsert<T extends object>(
		data: T[],
		keyField: keyof T,
		collectionName: CollectionName,
		dataName = "Generic Data",
		validator?: z.ZodType<T>,
	): Promise<boolean> {
		try {
			if (data.length === 0) {
				console.warn(`No ${dataName} data to upsert, aborted operation`);
				return false;
			}

			// Validate data if validator is provided
			if (validator) {
				for (const item of data) {
					validator.parse(item);
				}
			}
			// Create bulk operations using the correct MongoDB interface
			const bulkOps = data.map((item) => ({
				updateOne: {
					filter: { [keyField]: item[keyField] },
					update: { $set: item },
					upsert: true,
				},
			}));

			const result =
				await this.getCollection(collectionName).bulkWrite(bulkOps);

			console.log(
				`Upserted ${result.upsertedCount} | Modified ${result.modifiedCount} | Matched ${result.matchedCount} --> ${dataName}`,
			);
			return true;
		} catch (error) {
			console.error(`Error uploading ${dataName} to MongoDB: ${error}`);
			return false;
		}
	}
}

export default new DBHelper();
