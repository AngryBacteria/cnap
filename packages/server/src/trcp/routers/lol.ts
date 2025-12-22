import { TRPCError } from "@trpc/server";
import { and, count, desc, eq, sql, sum } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { z } from "zod/v4";
import { db } from "../../db/index.js";
import {
	LEAGUE_CHAMPIONS_TABLE,
	LEAGUE_GAME_MODES_TABLE,
	LEAGUE_ITEMS_TABLE,
	LEAGUE_MAPS_TABLE,
	LEAGUE_MATCH_PARTICIPANTS_TABLE,
	LEAGUE_QUEUES_TABLE,
	LEAGUE_SUMMONER_SPELLS_TABLE,
	LEAGUE_SUMMONERS_TABLE,
} from "../../db/schemas/index.js";
import { to } from "../../helpers/General.js";
import logger from "../../helpers/Logger.js";
import rh from "../../helpers/RiotHelper.js";
import { loggedProcedure } from "../middlewares/executionTime.js";
import { router } from "../trcp.js";

const item0Alias = alias(LEAGUE_ITEMS_TABLE, "item0Alias");
const item1Alias = alias(LEAGUE_ITEMS_TABLE, "item1Alias");
const item2Alias = alias(LEAGUE_ITEMS_TABLE, "item2Alias");
const item3Alias = alias(LEAGUE_ITEMS_TABLE, "item3Alias");
const item4Alias = alias(LEAGUE_ITEMS_TABLE, "item4Alias");
const item5Alias = alias(LEAGUE_ITEMS_TABLE, "item5Alias");
const item6Alias = alias(LEAGUE_ITEMS_TABLE, "item6Alias");

const summonerSpell1Alias = alias(
	LEAGUE_SUMMONER_SPELLS_TABLE,
	"summonerSpell1Alias",
);
const summonerSpell2Alias = alias(
	LEAGUE_SUMMONER_SPELLS_TABLE,
	"summonerSpell2Alias",
);

// Test riot api connection
await rh.testConnection();

export const lolRouter = router({
	getChampionsReduced: loggedProcedure.query(async () => {
		const [champions, error] = await to(
			db.query.LEAGUE_CHAMPIONS_TABLE.findMany(),
		);

		if (error) {
			logger.error(
				{ err: error },
				"API:getChampionsReduced - failed to fetch champions from db",
			);
			throw new TRPCError({
				message: `Champions couldn't be fetched`,
				code: "INTERNAL_SERVER_ERROR",
				cause: error,
			});
		}

		logger.debug("API:getChampionsReduced - fetched champions from db");
		return champions;
	}),
	getChampionById: loggedProcedure.input(z.number()).query(async (opts) => {
		const [champion, error] = await to(
			db.query.LEAGUE_CHAMPIONS_TABLE.findFirst({
				where: {
					id: opts.input,
				},
				with: {
					playstyle: true,
					tacticalInfo: true,
					skins: true,
					passives: true,
					spells: true,
				},
			}),
		);

		if (error) {
			logger.error(
				{ err: error },
				"API:getChampionById - failed to fetch champion by id",
			);
			throw new TRPCError({
				message: `Champion couldn't be fetched`,
				code: "INTERNAL_SERVER_ERROR",
				cause: error,
			});
		}

		if (!champion) {
			logger.error(
				{ operationInputs: opts.input },
				"API:getChampionById - no champion found with this id",
			);
			throw new TRPCError({
				message: `Champion not found: ${opts.input}`,
				code: "NOT_FOUND",
			});
		}

		logger.debug(
			{ operationInputs: opts.input },
			"API:getChampionById - fetched champion by id",
		);
		return champion;
	}),
	getMatchesParticipant: loggedProcedure
		.input(
			z.object({
				page: z.number().default(1),
				championId: z.number().optional(),
				queueId: z.number().optional(),
				gameName: z.string().optional(),
				tagLine: z.string().optional(),
				lane: z.string().optional(),
			}),
		)
		.query(async (opts) => {
			const { page, championId, queueId, gameName, tagLine, lane } = opts.input;

			const PAGE_SIZE = 20;
			const currentPage = Math.max(1, page);
			const offset = (currentPage - 1) * PAGE_SIZE;

			const whereConditions = and(
				gameName ? eq(LEAGUE_SUMMONERS_TABLE.gameName, gameName) : undefined,
				tagLine ? eq(LEAGUE_SUMMONERS_TABLE.tagLine, tagLine) : undefined,
				championId
					? eq(LEAGUE_MATCH_PARTICIPANTS_TABLE.championId, championId)
					: undefined,
				queueId
					? eq(LEAGUE_MATCH_PARTICIPANTS_TABLE.queueId, queueId)
					: undefined,
				lane
					? eq(LEAGUE_MATCH_PARTICIPANTS_TABLE.teamPosition, lane)
					: undefined,
			);

			const [countResult, countError] = await to(
				db
					.select({
						value: count(),
					})
					.from(LEAGUE_MATCH_PARTICIPANTS_TABLE)
					.leftJoin(
						LEAGUE_SUMMONERS_TABLE,
						eq(
							LEAGUE_MATCH_PARTICIPANTS_TABLE.puuid,
							LEAGUE_SUMMONERS_TABLE.puuid,
						),
					)
					.where(whereConditions),
			);

			if (countError) {
				logger.error(
					{ err: countError },
					"API:getMatchesParticipant - counting participants failed",
				);
				throw new TRPCError({
					message: `Participants couldn't be counted for pagination`,
					code: "INTERNAL_SERVER_ERROR",
					cause: countError,
				});
			}

			const totalCount = countResult?.[0]?.value ?? 0;
			const totalPages = Math.ceil(totalCount / PAGE_SIZE);

			const [matches, error] = await to(
				db
					.select({
						participant: LEAGUE_MATCH_PARTICIPANTS_TABLE,
						summoner: LEAGUE_SUMMONERS_TABLE,
						item0: item0Alias,
						item1: item1Alias,
						item2: item2Alias,
						item3: item3Alias,
						item4: item4Alias,
						item5: item5Alias,
						item6: item6Alias,
						queue: LEAGUE_QUEUES_TABLE,
						gameMode: LEAGUE_GAME_MODES_TABLE,
						map: LEAGUE_MAPS_TABLE,
						champion: LEAGUE_CHAMPIONS_TABLE,
						summonerSpell1: summonerSpell1Alias,
						summonerSpell2: summonerSpell2Alias,
					})
					.from(LEAGUE_MATCH_PARTICIPANTS_TABLE)
					.leftJoin(
						LEAGUE_SUMMONERS_TABLE,
						eq(
							LEAGUE_MATCH_PARTICIPANTS_TABLE.puuid,
							LEAGUE_SUMMONERS_TABLE.puuid,
						),
					)
					.leftJoin(
						item0Alias,
						eq(LEAGUE_MATCH_PARTICIPANTS_TABLE.item0, item0Alias.id),
					)
					.leftJoin(
						item1Alias,
						eq(LEAGUE_MATCH_PARTICIPANTS_TABLE.item1, item1Alias.id),
					)
					.leftJoin(
						item2Alias,
						eq(LEAGUE_MATCH_PARTICIPANTS_TABLE.item2, item2Alias.id),
					)
					.leftJoin(
						item3Alias,
						eq(LEAGUE_MATCH_PARTICIPANTS_TABLE.item3, item3Alias.id),
					)
					.leftJoin(
						item4Alias,
						eq(LEAGUE_MATCH_PARTICIPANTS_TABLE.item4, item4Alias.id),
					)
					.leftJoin(
						item5Alias,
						eq(LEAGUE_MATCH_PARTICIPANTS_TABLE.item5, item5Alias.id),
					)
					.leftJoin(
						item6Alias,
						eq(LEAGUE_MATCH_PARTICIPANTS_TABLE.item6, item6Alias.id),
					)
					.leftJoin(
						LEAGUE_QUEUES_TABLE,
						eq(
							LEAGUE_MATCH_PARTICIPANTS_TABLE.queueId,
							LEAGUE_QUEUES_TABLE.queueId,
						),
					)
					.leftJoin(
						LEAGUE_GAME_MODES_TABLE,
						eq(
							LEAGUE_MATCH_PARTICIPANTS_TABLE.gameMode,
							LEAGUE_GAME_MODES_TABLE.gameMode,
						),
					)
					.leftJoin(
						LEAGUE_MAPS_TABLE,
						eq(LEAGUE_MATCH_PARTICIPANTS_TABLE.mapId, LEAGUE_MAPS_TABLE.mapId),
					)
					.leftJoin(
						LEAGUE_CHAMPIONS_TABLE,
						eq(
							LEAGUE_MATCH_PARTICIPANTS_TABLE.championId,
							LEAGUE_CHAMPIONS_TABLE.id,
						),
					)
					.leftJoin(
						summonerSpell1Alias,
						eq(
							LEAGUE_MATCH_PARTICIPANTS_TABLE.summoner1Id,
							summonerSpell1Alias.id,
						),
					)
					.leftJoin(
						summonerSpell2Alias,
						eq(
							LEAGUE_MATCH_PARTICIPANTS_TABLE.summoner2Id,
							summonerSpell2Alias.id,
						),
					)
					.where(whereConditions)
					.orderBy(desc(LEAGUE_MATCH_PARTICIPANTS_TABLE.gameCreation))
					.limit(PAGE_SIZE)
					.offset(offset),
			);

			if (error) {
				logger.error({ err: error }, "API:getMatchesParticipant");
				throw new TRPCError({
					message: `Matches couldn't be fetched`,
					code: "INTERNAL_SERVER_ERROR",
					cause: error,
				});
			}

			return {
				data: matches,
				pagination: {
					currentPage,
					totalPages,
					totalCount,
					pageSize: PAGE_SIZE,
				},
			};
		}),
	getQueues: loggedProcedure.query(async () => {
		const [queues, error] = await to(db.query.LEAGUE_QUEUES_TABLE.findMany());
		if (error) {
			logger.error(
				{ err: error },
				"API:getQueues - fetching queues from db failed",
			);
			throw new TRPCError({
				message: `Queues couldn't be fetched`,
				code: "INTERNAL_SERVER_ERROR",
				cause: error,
			});
		}

		logger.debug("API:getQueues - fetched queues from db");
		return queues;
	}),
	getItems: loggedProcedure.query(async () => {
		const [items, error] = await to(db.query.LEAGUE_ITEMS_TABLE.findMany());
		if (error) {
			logger.error(
				{ err: error },
				"API:getItems - failed to fetch items from db",
			);
			throw new TRPCError({
				message: `Items couldn't be fetched`,
				code: "INTERNAL_SERVER_ERROR",
				cause: error,
			});
		}

		logger.debug("API:getItems - fetched items from db");
		return items;
	}),
	getSummonerSpells: loggedProcedure.query(async () => {
		const [spells, error] = await to(
			db.query.LEAGUE_SUMMONER_SPELLS_TABLE.findMany(),
		);
		if (error) {
			logger.error(
				{ err: error },
				"API:getSummonerSpells - failed to fetch summonerSpells from db",
			);
			throw new TRPCError({
				message: `SummonerSpells couldn't be fetched`,
				code: "INTERNAL_SERVER_ERROR",
				cause: error,
			});
		}

		logger.debug("API:getSummonerSpells - fetched summonerSpells from db");
		return spells;
	}),
	getSummoners: loggedProcedure.query(async () => {
		const [summoners, error] = await to(
			db.query.LEAGUE_SUMMONERS_TABLE.findMany(),
		);
		if (error) {
			logger.error(
				{ err: error },
				"API:getSummoners - failed to fetch summoners from db",
			);
			throw new TRPCError({
				message: `Summoners couldn't be fetched`,
				code: "INTERNAL_SERVER_ERROR",
				cause: error,
			});
		}

		logger.debug("API:getSummoners - fetched summoners from db");
		return summoners;
	}),
	getSummonerByName: loggedProcedure
		.input(
			z.object({
				gameName: z.string(),
				tagLine: z.string(),
			}),
		)
		.query(async (opts) => {
			const [summoner, error] = await to(
				db.query.LEAGUE_SUMMONERS_TABLE.findFirst({
					where: {
						gameName: opts.input.gameName,
						tagLine: opts.input.tagLine,
					},
				}),
			);

			if (error) {
				logger.error(
					{
						err: error,
						tagLine: opts.input.tagLine,
						gameName: opts.input.gameName,
						code: "INTERNAL_SERVER_ERROR",
					},
					"API:getSummonerByName - failed to fetch summoner by name and tagline from db",
				);
				throw new TRPCError({
					message: `Summoner couldn't be fetched`,
					code: "INTERNAL_SERVER_ERROR",
					cause: error,
				});
			}

			if (!summoner) {
				logger.warn(
					{
						tagLine: opts.input.tagLine,
						gameName: opts.input.gameName,
						code: "NOT_FOUND",
					},
					"API:getSummonerByName - no summoner found with this name and tagline in db",
				);
				throw new TRPCError({
					message: `Database returned no members for name: ${opts.input.gameName} and tagLine: ${opts.input.tagLine}`,
					code: "NOT_FOUND",
				});
			}

			logger.debug(
				{ operationInputs: opts.input },
				"API:getSummonerByName - fetched summoner by name and tagline from db",
			);
			return summoner;
		}),
	getSummonerSummaryByName: loggedProcedure
		.input(
			z.object({
				gameName: z.string(),
				tagLine: z.string(),
			}),
		)
		.query(async (opts) => {
			const [summoner, _] = await to(
				db.query.LEAGUE_SUMMONERS_TABLE.findFirst({
					where: {
						memberGameName: opts.input.gameName,
						tagLine: opts.input.tagLine,
					},
				}),
			);
			if (!summoner) {
				throw new TRPCError({
					message: `Summoner not found: ${opts.input.gameName} and tagLine: ${opts.input.tagLine}`,
					code: "NOT_FOUND",
				});
			}

			const gamesCount = count().as("games");
			const winCount = sql<number>`COUNT(CASE WHEN win = TRUE THEN 1 END)`.as(
				"wins",
			);

			const [summonerSummary, error] = await to(
				db
					.select({
						teamPosition: LEAGUE_MATCH_PARTICIPANTS_TABLE.teamPosition,
						championName: LEAGUE_CHAMPIONS_TABLE.name,
						queueName: LEAGUE_QUEUES_TABLE.description,

						games: gamesCount,
						wins: winCount,

						secondsPlayed: sum(
							LEAGUE_MATCH_PARTICIPANTS_TABLE.gameDuration,
						).mapWith(Number),
						kills: sum(LEAGUE_MATCH_PARTICIPANTS_TABLE.kills).mapWith(Number),
						deaths: sum(LEAGUE_MATCH_PARTICIPANTS_TABLE.deaths).mapWith(Number),
						assists: sum(LEAGUE_MATCH_PARTICIPANTS_TABLE.assists).mapWith(
							Number,
						),
						doubleKills: sum(
							LEAGUE_MATCH_PARTICIPANTS_TABLE.doubleKills,
						).mapWith(Number),
						tripleKills: sum(
							LEAGUE_MATCH_PARTICIPANTS_TABLE.tripleKills,
						).mapWith(Number),
						quadraKills: sum(
							LEAGUE_MATCH_PARTICIPANTS_TABLE.quadraKills,
						).mapWith(Number),
						pentaKills: sum(LEAGUE_MATCH_PARTICIPANTS_TABLE.pentaKills).mapWith(
							Number,
						),
						totalVisionScore: sum(
							LEAGUE_MATCH_PARTICIPANTS_TABLE.visionScore,
						).mapWith(Number),
					})
					.from(LEAGUE_MATCH_PARTICIPANTS_TABLE)
					.leftJoin(
						LEAGUE_QUEUES_TABLE,
						eq(
							LEAGUE_MATCH_PARTICIPANTS_TABLE.queueId,
							LEAGUE_QUEUES_TABLE.queueId,
						),
					)
					.leftJoin(
						LEAGUE_CHAMPIONS_TABLE,
						eq(
							LEAGUE_MATCH_PARTICIPANTS_TABLE.championId,
							LEAGUE_CHAMPIONS_TABLE.id,
						),
					)
					.where(eq(LEAGUE_MATCH_PARTICIPANTS_TABLE.puuid, summoner.puuid))
					.groupBy(
						LEAGUE_MATCH_PARTICIPANTS_TABLE.teamPosition,
						LEAGUE_QUEUES_TABLE.description,
						LEAGUE_CHAMPIONS_TABLE.name,
					)
					.orderBy(desc(gamesCount)),
			);

			if (error) {
				logger.error(
					{
						err: error,
						tagLine: opts.input.tagLine,
						gameName: opts.input.gameName,
						code: "INTERNAL_SERVER_ERROR",
					},
					"API:getSummonerByName - failed to fetch summoner summary",
				);
				throw new TRPCError({
					message: `Summoner couldn't be fetched`,
					code: "INTERNAL_SERVER_ERROR",
					cause: error,
				});
			}

			if (!summonerSummary) {
				logger.warn(
					{
						tagLine: opts.input.tagLine,
						gameName: opts.input.gameName,
						code: "NOT_FOUND",
					},
					"API:getSummonerByName - no summoner summary found with this name/tagline in db",
				);
				throw new TRPCError({
					message: `Database returned no summoner summary for name: ${opts.input.gameName} and tagLine: ${opts.input.tagLine}`,
					code: "NOT_FOUND",
				});
			}

			logger.debug(
				{ operationInputs: opts.input },
				"API:getSummonerByName - fetched summoner summary by name and tagline from db",
			);
			return summonerSummary;
		}),
});
