export type MongoPipeline = Record<string, unknown>[];
export type MongoFilter = Record<string, unknown>;
export type MongoProjection = Record<string, number>;

export type DBResponse<T> = {
	data: T[];
	success: boolean;
	error?: Error;
	message?: string;
};

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
	PEN_AND_PAPER_SESSION = "pen_and_paper_session",
	PEN_AND_PAPER_CHARACTER = "pen_and_paper_character",
	SUMMONER = "summoner",
}
