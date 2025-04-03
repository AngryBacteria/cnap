import { z } from "zod";

export type MongoPipeline = Record<string, unknown>[];
export type MongoFilter = Record<string, unknown>;
export type MongoProjection = Record<string, number>;

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
