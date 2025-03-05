import fs from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import express from "express";
import { SummonerSummarySchema } from "src/model/SummonerSummary.js";
import { z } from "zod";
import dbh, { CollectionName } from "../helpers/DBHelper.js";
import logger from "../helpers/Logger.js";
import simpleCache from "../helpers/SimpleCache.js";
import { ChampionReducedSchema, ChampionSchema } from "../model/Champion.js";
import { ItemSchema } from "../model/Item.js";
import type { MatchV5Participant } from "../model/MatchV5.js";
import { QueueSchema } from "../model/Queue.js";
import { SummonerDbSchema } from "../model/SummonerDb.js";
import { SummonerSpellSchema } from "../model/SummonerSpell.js";
import { loggedProcedure } from "./middlewares/executionTime.js";

// Static file paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const staticFilesPath = join(__dirname, "..", "..", "..", "static");
if (!fs.existsSync(staticFilesPath)) {
	throw new Error(`The folder at ${staticFilesPath} does not exist.`);
}

const t = initTRPC.create();
const appRouter = t.router({
	userList: loggedProcedure.query(() => {
		return [
			{ id: 1, name: "John Doe" },
			{ id: 2, name: "Jane Doe" },
		];
	}),
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
		simpleCache.set("championReduced", result);
		logger.info({ cached: false }, "API:getChampionsReduced");
		return result;
	}),
	getChampionByAlias: loggedProcedure.input(z.string()).query(async (opts) => {
		const dbResult = await dbh.genericGet(
			CollectionName.CHAMPION,
			{
				filter: { alias: { $regex: `^${opts.input}$`, $options: "i" } },
			},
			ChampionSchema,
		);
		if (!dbResult[0]) {
			logger.error(
				{ operationInputs: opts.input },
				"API:getChampionByAlias - Champion not found",
			);
			throw new Error(`Champion not found: ${opts.input}`);
		}
		logger.info(
			{ operationInputs: opts.input, cached: false },
			"API:getChampionByAlias",
		);
		return dbResult[0];
	}),
	getMatchesParticipant: loggedProcedure
		.input(
			z.object({
				championId: z.number().optional(),
				queueId: z.number().optional(),
				onlySummonersInDb: z.boolean().default(true),
				page: z.number().default(1),
			}),
		)
		.query(async (opts) => {
			const { championId, queueId, onlySummonersInDb, page } = opts.input;

			// Pagination
			const pageSize = 10;
			const skip = (page - 1) * pageSize;

			// Init the pipeline
			const pipeline: Record<string, unknown>[] = [];

			// Optionally filter by champion id
			if (championId) {
				pipeline.push({
					$match: { "info.participants.championId": championId },
				});
			}

			// Optionally Filter by summoner puuids
			let summonerPuuids: string[] = [];
			if (onlySummonersInDb) {
				const existingSummonerPuuids = await dbh.genericGet(
					CollectionName.SUMMONER,
					{
						limit: 100000,
						project: { puuid: 1 },
					},
					z.object({ puuid: z.string() }),
				);

				summonerPuuids = existingSummonerPuuids.map(
					(summoner) => summoner.puuid,
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

			// Optionally filter unwinder document again by champion id
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

			// Sort and paginate
			pipeline.push(
				{ $sort: { "info.gameCreation": -1 } },
				{
					$facet: {
						metadata: [{ $count: "total" }],
						data: [
							{ $skip: skip },
							{ $limit: pageSize },
							{ $project: { _id: 0 } },
						],
					},
				},
			);

			// TODO: use helper function
			const collection = dbh.getCollection(CollectionName.MATCH);
			const cursor = collection.aggregate(pipeline);

			const result = await cursor.toArray();

			const metadata = result[0]?.metadata || [];
			const total = metadata[0]?.total || 0;

			const maxPage = Math.ceil(total / pageSize);
			const data = (result[0]?.data || []) as MatchV5Participant[];

			logger.info(
				{ operationInputs: opts.input, cached: false },
				"API:getMatchesParticipant",
			);
			return {
				page,
				maxPage,
				data,
			};
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
		simpleCache.set("getQueues", result);
		logger.info({ cached: false }, "API:getQueues");
		return result;
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
		simpleCache.set("getItems", results);
		logger.info({ cached: false }, "API:getItems");
		return results;
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
		simpleCache.set("getSummonerSpells", result);
		logger.info({ cached: false }, "API:getSummonerSpells");
		return result;
	}),
	getSummoners: loggedProcedure.query(async () => {
		const cachedResult = SummonerDbSchema.array().safeParse(
			simpleCache.get("getSummoners"),
		);
		if (cachedResult.success) {
			logger.info({ cached: true }, "API:getSummoners");
			return cachedResult.data;
		}

		const result = await dbh.genericGet(
			CollectionName.SUMMONER,
			{ limit: 1000 },
			SummonerDbSchema,
		);
		simpleCache.set("getSummoners", result);
		logger.info({ cached: false }, "API:getSummoners");
		return result;
	}),
	getSummonerSummary: loggedProcedure.input(z.string()).query(async (opts) => {
		const pipeline = [
			{
				$match: {
					"info.participants.puuid": opts.input,
				},
			},
			{
				$unwind: {
					path: "$info.participants",
				},
			},
			{
				$match: {
					"info.participants.puuid": opts.input,
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
		logger.info({ cached: false }, "API:getSummonerSummary");
		return result;
	}),
});

const app = express();
app.use(cors());
app.use("/static", express.static(staticFilesPath));
app.use(
	"/trpc",
	trpcExpress.createExpressMiddleware({
		router: appRouter,
	}),
);
app.listen(3000);
logger.info(
	{
		port: 3000,
		baseUrl: "http://localhost",
		url: "http://localhost:3000/trpc",
	},
	"API:Startup - tRPC Server is running",
);

export type AppRouter = typeof appRouter;
