import { z } from "zod";
import {ObjectId} from "mongodb";

export const MongoDBIDSchema = z
	.instanceof(ObjectId, { message: "Input must be a BSON ObjectId" })
	.transform((objectId) => objectId.toHexString());

export type MongoPipeline = Record<string, unknown>[];
export type MongoFilter = Record<string, unknown>;

export type DBResponse<T> = {
	data: T[];
	success: boolean;
	error?: Error;
	message?: string;
};

export type DBResponsePaginated<T> = {
	data: {
		data: T[];
		page: number;
		maxPage: number;
	};
	success: boolean;
	error?: Error;
	message?: string;
};

/**
 * Response from MongoDB for a paginated query (pipeline)
 */
export const MongoDBPaginationSchema = z
	.object({
		data: z.unknown(),
		metadata: z
			.object({
				total: z.number(),
			})
			.array(),
	})
	.array();

export type MongoDBPagination = z.infer<typeof MongoDBPaginationSchema>;

/**
 * Enum representing the names of various collections in the MongoDB database.
 */
export enum CollectionName {
	CHAMPION = "champion",
	GAME_MODE = "game_mode",
	GAME_TYPE = "game_type",
	ITEM = "item",
	MAP = "map",
	MATCH = "match_v5",
	MEMBER = "member",
	QUEUE = "queue",
	SUMMONER_ICON = "summoner_icon",
	SUMMONER_SPELL = "summoner_spell",
	TIMELINE = "timeline_v5",
	SESSION = "session",
	SUMMONER = "summoner",
}

/**
 * Zod schema for basic filtering options.
 * Validates filtering input for database queries.
 */
export const BasicFilterSchema = z.object({
	offset: z
		.number()
		.int()
		.nonnegative()
		.optional()
		.default(0)
		.describe("Number of items to skip"),
	limit: z
		.number()
		.int()
		.positive()
		.optional()
		.default(5)
		.describe("Maximum number of items to return"),
	project: z
		.record(z.string(), z.number())
		.optional()
		.default({})
		.describe("Fields to return"),
	filter: z.record(z.string(), z.any()).default({}).describe("Filter to apply"),
});
export type BasicFilter = z.infer<typeof BasicFilterSchema>;

export const DEFAULT_FILTER: BasicFilter = {
	offset: 0,
	limit: 5,
	project: {},
	filter: {}
};
