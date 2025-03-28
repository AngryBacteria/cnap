import { TRPCError } from "@trpc/server";
import { z } from "zod";
import dbh from "../../helpers/DBHelper.js";
import logger from "../../helpers/Logger.js";
import rh from "../../helpers/RiotHelper.js";
import simpleCache from "../../helpers/SimpleCache.js";
import { ChampionReducedSchema, ChampionSchema } from "../../model/Champion.js";
import { CollectionName } from "../../model/Database.js";
import { ItemSchema } from "../../model/Item.js";
import type { MatchV5Participant } from "../../model/MatchV5.js";
import { QueueSchema } from "../../model/Queue.js";
import {
	SummonerDbSchema,
	SummonerSummarySchema,
} from "../../model/Summoner.js";
import { SummonerSpellSchema } from "../../model/SummonerSpell.js";
import { loggedProcedure } from "../middlewares/executionTime.js";
import { router } from "../trcp.js";

// Test riot api connection
await rh.testConnection();

export const lolRouter = router({
	getChampionsReduced: loggedProcedure.query(async () => {
		const cachedResult = ChampionReducedSchema.array().safeParse(
			simpleCache.get("championReduced"),
		);
		if (cachedResult.success) {
			logger.info({ cached: true }, "API:getChampionsReduced");
			return cachedResult.data;
		}

		const result = await dbh.genericGet(
			CollectionName.CHAMPION,
			{
				limit: 1000,
				project: {
					_id: 0,
					id: 1,
					name: 1,
					alias: 1,
					title: 1,
					shortBio: 1,
					uncenteredSplashPath: 1,
				},
			},
			ChampionReducedSchema,
		);
		if (!result.success) {
			logger.error({ error: result.error }, "API:getChampionsReduced");
			throw new TRPCError({
				message: `Champions couldn't be fetched`,
				code: "INTERNAL_SERVER_ERROR",
			});
		}

		simpleCache.set("championReduced", result.data);
		logger.info({ cached: false }, "API:getChampionsReduced");
		return result.data;
	}),
	getChampionById: loggedProcedure.input(z.number()).query(async (opts) => {
		const dbResult = await dbh.genericGet(
			CollectionName.CHAMPION,
			{
				filter: { id: opts.input },
			},
			ChampionSchema,
		);

		if (!dbResult.success) {
			logger.error({ error: dbResult.error }, "API:getChampionById");
			throw new TRPCError({
				message: `Champion couldn't be fetched`,
				code: "INTERNAL_SERVER_ERROR",
			});
		}

		if (!dbResult.data[0]) {
			logger.error({ operationInputs: opts.input }, "API:getChampionById");
			throw new TRPCError({
				message: `Champion not found: ${opts.input}`,
				code: "NOT_FOUND",
			});
		}
		logger.info(
			{ operationInputs: opts.input, cached: false },
			"API:getChampionById",
		);
		return dbResult.data[0];
	}),
	// TODO: dont use puuid, use gameName and tagLine
	getMatchesParticipant: loggedProcedure
		.input(
			z.object({
				page: z.number().default(1),
				championId: z.number().optional(),
				queueId: z.number().optional(),
				summonerPuuid: z.string().optional(),
				onlySummonersInDb: z.boolean().default(true),
			}),
		)
		.query(async (opts) => {
			const { page, championId, queueId, summonerPuuid, onlySummonersInDb } =
				opts.input;

			// Init the pipeline
			const pipeline: Record<string, unknown>[] = [];

			//Optionally filter by puuid
			if (summonerPuuid) {
				pipeline.push({
					$match: { "info.participants.puuid": summonerPuuid },
				});
			}

			// Optionally filter by champion id
			if (championId) {
				pipeline.push({
					$match: { "info.participants.championId": championId },
				});
			}

			// Optionally Filter by summoner puuids
			let summonerPuuids: string[] = [];
			if (onlySummonersInDb) {
				const existingPuuidsResponse = await dbh.genericGet(
					CollectionName.SUMMONER,
					{
						limit: 100000,
						project: { puuid: 1 },
					},
					z.object({
						puuid: z.string(),
					}),
				);
				if (!existingPuuidsResponse.success) {
					logger.error(
						{ error: existingPuuidsResponse.error },
						"API:getMatchesParticipant",
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

			// Optionally filter unwinded document again by puuid
			if (summonerPuuid) {
				pipeline.push({
					$match: { "info.participants.puuid": summonerPuuid },
				});
			}

			// Optionally filter unwinded document again by champion id
			if (championId) {
				pipeline.push({
					$match: { "info.participants.championId": championId },
				});
			}

			// Optionally filter unwinded documents again by summoner puuids
			if (onlySummonersInDb) {
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
				logger.error({ error: dbResult.error }, "API:getMatchesParticipant");
				throw new TRPCError({
					message: `Matches couldn't be fetched`,
					code: "INTERNAL_SERVER_ERROR",
				});
			}

			logger.info(
				{ operationInputs: opts.input, cached: false },
				"API:getMatchesParticipant",
			);
			return dbResult.data;
		}),
	getQueues: loggedProcedure.query(async () => {
		const cachedResult = QueueSchema.array().safeParse(
			simpleCache.get("getQueues"),
		);
		if (cachedResult.success) {
			logger.info({ cached: true }, "API:getQueues");
			return cachedResult.data;
		}

		const result = await dbh.genericGet(
			CollectionName.QUEUE,
			{ limit: 1000 },
			QueueSchema,
		);
		if (!result.success) {
			logger.error({ error: result.error }, "API:getQueues");
			throw new TRPCError({
				message: `Queues couldn't be fetched`,
				code: "INTERNAL_SERVER_ERROR",
			});
		}

		simpleCache.set("getQueues", result.data);
		logger.info({ cached: false }, "API:getQueues");
		return result.data;
	}),
	getItems: loggedProcedure.query(async () => {
		const cachedResult = ItemSchema.array().safeParse(
			simpleCache.get("getItems"),
		);
		if (cachedResult.success) {
			logger.info({ cached: true }, "API:getItems");
			return cachedResult.data;
		}

		const results = await dbh.genericGet(
			CollectionName.ITEM,
			{ limit: 1000 },
			ItemSchema,
		);
		if (!results.success) {
			logger.error({ error: results.error }, "API:getItems");
			throw new TRPCError({
				message: `Items couldn't be fetched`,
				code: "INTERNAL_SERVER_ERROR",
			});
		}

		simpleCache.set("getItems", results.data);
		logger.info({ cached: false }, "API:getItems");
		return results.data;
	}),
	getSummonerSpells: loggedProcedure.query(async () => {
		const cachedResult = SummonerSpellSchema.array().safeParse(
			simpleCache.get("getSummonerSpells"),
		);
		if (cachedResult.success) {
			logger.info({ cached: true }, "API:getSummonerSpells");
			return cachedResult.data;
		}

		const result = await dbh.genericGet(
			CollectionName.SUMMONER_SPELL,
			{ limit: 1000 },
			SummonerSpellSchema,
		);
		if (!result.success) {
			logger.error({ error: result.error }, "API:getSummonerSpells");
			throw new TRPCError({
				message: `SummonerSpells couldn't be fetched`,
				code: "INTERNAL_SERVER_ERROR",
			});
		}

		simpleCache.set("getSummonerSpells", result.data);
		logger.info({ cached: false }, "API:getSummonerSpells");
		return result.data;
	}),
	getSummoners: loggedProcedure.query(async () => {
		const cachedResult = SummonerDbSchema.array().safeParse(
			simpleCache.get("getSummoners"),
		);
		if (cachedResult.success) {
			logger.info({ cached: true }, "API:getSummoners");
			return cachedResult.data;
		}

		const summonerResponse = await dbh.genericGet(
			CollectionName.SUMMONER,
			{ limit: 1000 },
			SummonerDbSchema,
		);
		if (!summonerResponse.success) {
			logger.error({ error: summonerResponse.error }, "API:getSummoners");
			throw new TRPCError({
				message: `Summoners couldn't be fetched`,
				code: "INTERNAL_SERVER_ERROR",
			});
		}

		simpleCache.set("getSummoners", summonerResponse.data);
		logger.info({ cached: false }, "API:getSummoners");
		return summonerResponse.data;
	}),
	getSummonerByName: loggedProcedure
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
						error: summonerResponse.error,
						puuid: opts.input,
						code: "INTERNAL_SERVER_ERROR",
					},
					"API:getSummonerByName",
				);
				throw new TRPCError({
					message: `Summoner couldn't be fetched`,
					code: "INTERNAL_SERVER_ERROR",
				});
			}

			if (!summonerResponse.data[0]) {
				logger.warn(
					{
						puuid: opts.input,
						code: "NOT_FOUND",
						message: `Database returned no members for PUUID: ${opts.input}`,
					},
					"API:getSummonerByName",
				);
				throw new TRPCError({
					message: `Database returned no members for PUUID: ${opts.input}`,
					code: "NOT_FOUND",
				});
			}

			logger.info(
				{ operationInputs: opts.input, cached: false },
				"API:getSummonerByName",
			);
			return summonerResponse.data[0];
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
						error: summonerResponse.error,
						gameName: opts.input.gameName,
						tagLine: opts.input.tagLine,
						code: "INTERNAL_SERVER_ERROR",
					},
					"API:getSummonerSummaryByName",
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
						message: `Database returned no summoner: ${opts.input}`,
					},
					"API:getSummonerSummaryByName",
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
				logger.error({ error: result.error }, "API:getSummonerSummaryByName");
				throw new TRPCError({
					message: `Summoner summary couldn't be fetched`,
					code: "INTERNAL_SERVER_ERROR",
				});
			}

			logger.info({ cached: false }, "API:getSummonerSummaryByName");
			return result.data;
		}),
});
