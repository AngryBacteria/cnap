import { z } from "zod";

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

/**
 * Partial version of BasicFilter.
 */
export const PartialBasicFilter = BasicFilterSchema.partial();
export type PartialBasicFilter = z.infer<typeof PartialBasicFilter>;
