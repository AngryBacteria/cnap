import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { db } from "../../db/index.js";
import dbh from "../../helpers/DBHelper.js";
import logger from "../../helpers/Logger.js";
import { to } from "../../helpers/Promises.js";
import rh from "../../helpers/RiotHelper.js";
import {
	CollectionName,
	type MongoFilter,
	type MongoPipeline,
} from "../../model/Database.js";
import type { MatchV5Participant } from "../../model/MatchV5.js";
import {
	SummonerDbSchema,
	SummonerSummarySchema,
} from "../../model/Summoner.js";
import { loggedProcedure } from "../middlewares/executionTime.js";
import { router } from "../trcp.js";

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
			});
		}

		logger.debug("API:getChampionsReduced - fetched champions from db");
		return champions;
	}),
	getChampionById: loggedProcedure.input(z.number()).query(async (opts) => {
		const [champion, error] = await to(
			db.query.LEAGUE_CHAMPIONS_TABLE.findFirst({
				where: (champion, { eq }) => eq(champion.id, opts.input),
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
				onlySummonersInDb: z.boolean().default(true),
			}),
		)
		.query(async (opts) => {
			const {
				page,
				championId,
				queueId,
				gameName,
				tagLine,
				onlySummonersInDb,
			} = opts.input;

			// Init the pipeline
			const pipeline: MongoPipeline = [];

			// Optionally filter by champion id
			if (championId) {
				pipeline.push({
					$match: { "info.participants.championId": championId },
				});
			}

			// Optionally Filter by summoner puuids
			let summonerPuuids: string[] = [];
			if (onlySummonersInDb || gameName || tagLine) {
				const summonerFilter: MongoFilter = {};
				if (gameName) {
					summonerFilter.gameName = gameName;
				}
				if (tagLine) {
					summonerFilter.tagLine = tagLine;
				}
				const existingPuuidsResponse = await dbh.genericGet(
					CollectionName.SUMMONER,
					{
						limit: 100000,
						projection: { puuid: 1 },
						filter: summonerFilter,
					},
					z.object({
						puuid: z.string(),
					}),
				);
				if (!existingPuuidsResponse.success) {
					logger.error(
						{ err: existingPuuidsResponse.error },
						"API:getMatchesParticipant - fetching existing summoners failed",
					);
					throw new TRPCError({
						message: `Summoners couldn't be fetched`,
						code: "INTERNAL_SERVER_ERROR",
					});
				}
				summonerPuuids = existingPuuidsResponse.data.map(
					(responseObject) => responseObject.puuid,
				);
				pipeline.push({
					$match: { "info.participants.puuid": { $in: summonerPuuids } },
				});
			}

			// Filter by queue id
			if (queueId) {
				pipeline.push({ $match: { "info.queueId": queueId } });
			}

			// Unwind
			pipeline.push({
				$unwind: {
					path: "$info.participants",
					preserveNullAndEmptyArrays: true,
				},
			});

			// Optionally filter unwinded document again by champion id
			if (championId) {
				pipeline.push({
					$match: { "info.participants.championId": championId },
				});
			}

			// Optionally filter unwinded documents again by summoner puuids
			if (onlySummonersInDb || gameName || tagLine) {
				pipeline.push({
					$match: { "info.participants.puuid": { $in: summonerPuuids } },
				});
			}

			// Sort
			pipeline.push({ $sort: { "info.gameCreation": -1 } });

			const dbResult = await dbh.genericPaginatedPipeline<MatchV5Participant>(
				pipeline,
				CollectionName.MATCH,
				page,
			);
			if (!dbResult.success) {
				logger.error({ err: dbResult.error }, "API:getMatchesParticipant");
				throw new TRPCError({
					message: `Matches couldn't be fetched`,
					code: "INTERNAL_SERVER_ERROR",
				});
			}

			logger.debug(
				{ operationInputs: opts.input },
				"API:getMatchesParticipant - fetching matches for participant failed",
			);
			return dbResult.data;
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
					where: (summoner, { eq }) =>
						eq(summoner.gameName, opts.input.gameName) &&
						eq(summoner.tagLine, opts.input.tagLine),
				}),
			);

			if (error) {
				logger.error(
					{
						err: error,
						puuid: opts.input,
						code: "INTERNAL_SERVER_ERROR",
					},
					"API:getSummonerByName - failed to fetch summoner by name from db",
				);
				throw new TRPCError({
					message: `Summoner couldn't be fetched`,
					code: "INTERNAL_SERVER_ERROR",
				});
			}

			if (!summoner) {
				logger.warn(
					{
						puuid: opts.input,
						code: "NOT_FOUND",
					},
					"API:getSummonerByName - no summoner found with this name in db",
				);
				throw new TRPCError({
					message: `Database returned no members for name: ${opts.input}`,
					code: "NOT_FOUND",
				});
			}

			logger.debug(
				{ operationInputs: opts.input },
				"API:getSummonerByName - fetched summoner by name from db",
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
			const summonerResponse = await dbh.genericGet(
				CollectionName.SUMMONER,
				{
					filter: {
						gameName: opts.input.gameName,
						tagLine: opts.input.tagLine,
					},
				},
				SummonerDbSchema,
			);
			if (!summonerResponse.success) {
				logger.error(
					{
						err: summonerResponse.error,
						gameName: opts.input.gameName,
						tagLine: opts.input.tagLine,
						code: "INTERNAL_SERVER_ERROR",
					},
					"API:getSummonerSummaryByName - failed to fetch summoner summary by name from db",
				);
				throw new TRPCError({
					message: `Summoner couldn't be fetched`,
					code: "INTERNAL_SERVER_ERROR",
				});
			}

			if (!summonerResponse.data[0]) {
				logger.warn(
					{
						gameName: opts.input.gameName,
						tagLine: opts.input.tagLine,
						code: "NOT_FOUND",
					},
					"API:getSummonerSummaryByName - no summoner summary found in db with this name",
				);
				throw new TRPCError({
					message: `Database returned no summoners: ${opts.input}`,
					code: "NOT_FOUND",
				});
			}

			const pipeline = [
				{
					$match: {
						"info.participants.puuid": summonerResponse.data[0].puuid,
					},
				},
				{
					$unwind: {
						path: "$info.participants",
					},
				},
				{
					$match: {
						"info.participants.puuid": summonerResponse.data[0].puuid,
					},
				},
				{
					$group: {
						_id: {
							champion: "$info.participants.championName",
							queueId: "$info.queueId",
							teamPosition: "$info.participants.teamPosition",
						},
						totalMatches: {
							$sum: 1,
						},
						wins: {
							$sum: {
								$cond: [
									{
										$eq: ["$info.participants.win", true],
									},
									1,
									0,
								],
							},
						},
						secondsPlayed: {
							$sum: "$info.gameDuration",
						},
						kills: {
							$sum: "$info.participants.kills",
						},
						deaths: {
							$sum: "$info.participants.deaths",
						},
						assists: {
							$sum: "$info.participants.assists",
						},
						doubleKills: {
							$sum: "$info.participants.doubleKills",
						},
						tripleKills: {
							$sum: "$info.participants.tripleKills",
						},
						quadraKills: {
							$sum: "$info.participants.quadraKills",
						},
						pentaKills: {
							$sum: "$info.participants.pentaKills",
						},
						totalVisionScore: {
							$sum: "$info.participants.visionScore",
						},
					},
				},
				{
					$sort: {
						totalMatches: -1,
					},
				},
			];

			const result = await dbh.genericPipeline(
				pipeline,
				CollectionName.MATCH,
				SummonerSummarySchema,
			);
			if (!result.success) {
				logger.error(
					{ err: result.error },
					"API:getSummonerSummaryByName - failed to fetch summoner summary ba name",
				);
				throw new TRPCError({
					message: `Summoner summary couldn't be fetched`,
					code: "INTERNAL_SERVER_ERROR",
				});
			}

			logger.debug(
				"API:getSummonerSummaryByName - fetched summoner summary by nanme",
			);
			return result.data;
		}),
});
