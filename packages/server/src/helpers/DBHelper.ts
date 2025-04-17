/**
 * This file provides helper functions for interacting with MongoDB.
 * It uses environment variables for configuration, validates data using Zod,
 * and exposes methods for common database operations.
 */

import "dotenv/config";
import { type Collection, type Db, MongoClient } from "mongodb";
import type { z } from "zod";
import {
	CollectionName,
	type DBResponse,
	type DBResponsePaginated,
	MongoDBPaginationSchema,
	type MongoFilter,
	type MongoPipeline,
	type MongoProjection,
} from "../model/Database.js";
import logger from "./Logger.js";

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
		this.database = this.mongoClient.db("cnap");
	}

	/**
	 * Gets a MongoDB collection by its name.
	 * @param {CollectionName} name - The name of the collection.
	 */
	getCollection(name: CollectionName): Collection {
		return this.database.collection(name);
	}

	async disconnect(): Promise<boolean> {
		try {
			await this.mongoClient.close();
			logger.debug("DBHelper:disconnect");
			return true;
		} catch (error) {
			logger.error({ error }, "DBHelper:disconnect");
			return false;
		}
	}

	/**
	 * Tests the MongoDB connection by executing a ping command.
	 * Logs the connection status.
	 * @returns Returns true if the connection is successful, false otherwise.
	 */
	async testConnection(): Promise<boolean> {
		try {
			// Ping the database
			await this.database.command({ ping: 1 });
			logger.debug({ connected: true }, "DBHelper:testConnection");
			return true;
		} catch (e) {
			logger.error({ connected: false, error: e }, "DBHelper:testConnection");
			return false;
		}
	}

	/**
	 * Initializes indexes for various collections.
	 * Creates unique and non-unique indexes as required.
	 * @returns Returns true if all indexes are successfully created.
	 */
	async initIndexes(): Promise<boolean> {
		try {
			await this.getCollection(CollectionName.MEMBER).dropIndexes();
			await this.getCollection(CollectionName.MEMBER).createIndex("gameName", {
				unique: true,
			});
			logger.debug("DBHelper:initIndexes - Created Member indexes");

			await this.getCollection(CollectionName.SUMMONER).dropIndexes();
			await this.getCollection(CollectionName.SUMMONER).createIndex("puuid", {
				unique: true,
			});
			logger.debug("DBHelper:initIndexes - Created Summoner indexes");

			await this.getCollection(CollectionName.MATCH).dropIndexes();
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
			logger.debug("DBHelper:initIndexes - Created match indexes");

			await this.getCollection(CollectionName.TIMELINE).dropIndexes();
			await this.getCollection(CollectionName.TIMELINE).createIndex(
				"metadata.matchId",
				{ unique: true },
			);
			await this.getCollection(CollectionName.TIMELINE).createIndex(
				"metadata.participants",
				{ unique: false },
			);
			logger.debug("DBHelper:initIndexes - Created timeline indexes");

			await this.getCollection(CollectionName.CHAMPION).dropIndexes();
			await this.getCollection(CollectionName.CHAMPION).createIndex("id", {
				unique: true,
			});
			await this.getCollection(CollectionName.GAME_MODE).dropIndexes();
			await this.getCollection(CollectionName.GAME_MODE).createIndex(
				"gameMode",
				{ unique: true },
			);
			await this.getCollection(CollectionName.GAME_TYPE).dropIndexes();
			await this.getCollection(CollectionName.GAME_TYPE).createIndex(
				"gametype",
				{ unique: true },
			);
			await this.getCollection(CollectionName.ITEM).dropIndexes();
			await this.getCollection(CollectionName.ITEM).createIndex("id", {
				unique: true,
			});
			await this.getCollection(CollectionName.MAP).dropIndexes();
			await this.getCollection(CollectionName.MAP).createIndex("mapId", {
				unique: true,
			});
			await this.getCollection(CollectionName.QUEUE).dropIndexes();
			await this.getCollection(CollectionName.QUEUE).createIndex("queueId", {
				unique: true,
			});
			logger.debug("DBHelper:initIndexes - Created static data indexes");

			await this.getCollection(
				CollectionName.PEN_AND_PAPER_SESSION,
			).dropIndexes();
			await this.getCollection(
				CollectionName.PEN_AND_PAPER_SESSION,
			).createIndex("sessionName", {
				unique: true,
			});
			await this.getCollection(
				CollectionName.PEN_AND_PAPER_CHARACTER,
			).dropIndexes();
			await this.getCollection(
				CollectionName.PEN_AND_PAPER_CHARACTER,
			).createIndex("name", {
				unique: true,
			});
			logger.debug("DBHelper:initIndexes - Created P&P data indexes");

			logger.debug("DBHelper:initIndexes - All indexes created successfully");
			return true;
		} catch (error) {
			logger.error({ error }, "DBHelper:initIndexes - Error creating indexes");
			return false;
		}
	}

	/**
	 * Retrieves non-existing identifiers from the database.
	 * Compares provided ids with those existing in the specified collection.
	 * @param ids - Array of match or timeline identifiers.
	 * @param collectionName - The name of the collection to check.
	 * @param idField - The field in the document that contains the identifier.
	 * @returns {Promise<string[]>} Returns an array of non-existing ids.
	 */
	async getNonExistingIds(
		ids: string[],
		collectionName: CollectionName,
		idField: string,
	): Promise<DBResponse<string>> {
		try {
			const startTime = performance.now();
			if (!ids.length) {
				logger.warn(
					"DBHelper:getNonExistingIds - No ids provided, aborting operation and returning empty array",
				);
				return {
					data: [],
					success: true,
				};
			}

			const idsSet = new Set(ids);

			const existingIds = await this.getCollection(collectionName).distinct(
				idField,
				{ [idField]: { $in: Array.from(idsSet) } },
			);

			const nonExistingIds = Array.from(idsSet).filter(
				(id) => !existingIds.includes(id),
			);
			const processingTime = performance.now() - startTime;
			logger.debug(
				{
					existing: existingIds.length,
					total: idsSet.size,
					collectionName,
					processingTimeMS: processingTime.toFixed(2),
				},
				"DBHelper:getNonExistingIds",
			);
			return {
				data: nonExistingIds,
				success: true,
			};
		} catch (error) {
			logger.error({ error, collectionName }, "DBHelper:getNonExistingIds");
			return {
				data: [],
				success: false,
			};
		}
	}

	/**
	 * Generic method for retrieving data from a specified collection.
	 * Can optionally validate the returned data using a Zod validator.
	 * @param collectionName - The name of the collection.
	 * @param validator - Optional Zod schema for data validation.
	 * @param options
	 * @returns The queried data cast as type T[]. Only if schema is provided it is strong typed.
	 */
	async genericGet<T>(
		collectionName: CollectionName,
		options?: {
			filter?: MongoFilter;
			projection?: MongoProjection;
			offset?: number;
			limit?: number;
		},
		validator?: z.ZodType<T>,
	): Promise<DBResponse<T>> {
		const {
			filter = {},
			projection = {},
			offset = 0,
			limit = 5,
		} = options || {};
		try {
			const startTime = performance.now();
			const cursor = this.getCollection(collectionName)
				.find(filter, { projection })
				.skip(offset)
				.limit(limit);

			const dbResultRaw = await cursor.toArray();

			let output: T[];
			if (validator) {
				// Use validator to parse and convert the data to type T
				output = validator.array().parse(dbResultRaw);
			} else {
				output = dbResultRaw as unknown as T[];
			}

			const processingTime = performance.now() - startTime;
			logger.debug(
				{
					length: dbResultRaw.length,
					collectionName,
					processingTimeMS: processingTime.toFixed(2),
				},
				"DBHelper:genericGet",
			);

			return {
				data: output,
				success: true,
			};
		} catch (error) {
			logger.error({ error, collectionName }, "DBHelper:genericGet");
			return {
				data: [],
				success: false,
				error: error instanceof Error ? error : new Error(String(error)),
			};
		}
	}

	/**
	 * Gets a nested value from an object using a dot-separated path.
	 */
	getNestedValue(obj: unknown, path: string): unknown {
		return (
			path
				.split(".")
				// @ts-ignore
				.reduce((acc, key) => (acc ? acc[key] : undefined), obj)
		);
	}

	/**
	 * Generic upsert method for inserting or updating documents.
	 * Validates the data if a validator is supplied and uses a bulk operation to upsert the data.
	 * Upserting means that if a document with the same keyField exists, it will be updated/replaced.
	 * If not, it will be inserted.
	 * @param data - The array of data objects.
	 * @param keyField - The field used as a unique identifier.
	 * @param collectionName - The target collection.
	 * @param validator - Optional Zod validator for data validation.
	 * @returns True if the operation was successful.
	 */
	async genericUpsert<T extends object>(
		data: T[],
		keyField: string,
		collectionName: CollectionName,
		validator?: z.ZodType<T>,
	): Promise<boolean> {
		try {
			const startTime = performance.now();
			if (data.length === 0) {
				logger.warn(
					{ collectionName },
					"DBHelper:genericUpsert - No data to upsert, aborted operation",
				);
				return true;
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
					filter: { [keyField]: this.getNestedValue(item, keyField) },
					update: { $set: item },
					upsert: true,
				},
			}));

			const dbResult =
				await this.getCollection(collectionName).bulkWrite(bulkOps);

			const processingTime = performance.now() - startTime;
			logger.debug(
				{
					upserted: dbResult.upsertedCount,
					modified: dbResult.modifiedCount,
					matched: dbResult.matchedCount,
					collectionName,
					processingTimeMS: processingTime.toFixed(2),
				},
				"DBHelper:genericUpsert",
			);
			return true;
		} catch (error) {
			logger.error({ error, collectionName }, "DBHelper:genericUpsert");
			return false;
		}
	}

	async genericPipeline<T extends object>(
		pipeline: MongoPipeline,
		collectionName: CollectionName,
		validator?: z.ZodType<T>,
	): Promise<DBResponse<T>> {
		try {
			const startTime = performance.now();
			const cursor = this.getCollection(collectionName).aggregate(pipeline);

			const dbResultRaw = await cursor.toArray();
			let output: T[];
			if (validator) {
				// Use validator to parse and convert the data to type T
				output = validator.array().parse(dbResultRaw);
			} else {
				output = dbResultRaw as unknown as T[];
			}
			const processingTime = performance.now() - startTime;
			logger.debug(
				{
					collectionName,
					processingTimeMS: processingTime.toFixed(2),
				},
				"DBHelper:genericPipeline",
			);
			return {
				data: output,
				success: true,
			};
		} catch (error) {
			logger.error({ error, collectionName }, "DBHelper:genericPipeline");
			return {
				data: [],
				success: false,
				error: error instanceof Error ? error : new Error(String(error)),
			};
		}
	}

	async genericPaginatedPipeline<T extends object>(
		pipeline: MongoPipeline,
		collectionName: CollectionName,
		page: number,
		pageSize = 10,
		validator?: z.ZodType<T>,
	): Promise<DBResponsePaginated<T>> {
		try {
			const startTime = performance.now();

			const amountToSkip = (page - 1) * pageSize;
			const cursor = this.getCollection(collectionName).aggregate([
				...pipeline,
				{
					$facet: {
						metadata: [{ $count: "total" }],
						data: [
							{ $skip: amountToSkip },
							{ $limit: pageSize },
							{ $project: { _id: 0 } },
						],
					},
				},
			]);
			const dbResultRaw = await cursor.toArray();
			const dbResult = MongoDBPaginationSchema.parse(dbResultRaw);

			if (!dbResult[0]) {
				throw new Error("Paginated DB Response is empty");
			}
			const { data, metadata } = dbResult[0];

			const total = metadata[0]?.total || 0;
			const maxPage = Math.ceil(total / pageSize);

			let outputData: T[];
			if (validator) {
				// Use validator to parse and convert the data to type T
				outputData = validator.array().parse(data);
			} else {
				outputData = data as unknown as T[];
			}
			const processingTime = performance.now() - startTime;
			logger.debug(
				{
					collectionName,
					processingTimeMS: processingTime.toFixed(2),
				},
				"DBHelper:genericPaginatedPipeline",
			);
			return {
				success: true,
				data: {
					page,
					maxPage,
					data: outputData,
				},
			};
		} catch (error) {
			logger.error(
				{ error, collectionName },
				"DBHelper:genericPaginatedPipeline",
			);
			return {
				success: false,
				data: {
					page: 0,
					maxPage: 0,
					data: [],
				},
			};
		}
	}
}

export default new DBHelper();
