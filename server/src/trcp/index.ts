import fs from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import express from "express";
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
			logger.debug("[/getChampionsReduced] Returning cached result");
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
		logger.debug("[/getChampionsReduced] Returning DB result");
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
			logger.error(`Champion not found: ${opts.input}`);
			throw new Error(`Champion not found: ${opts.input}`);
		}
		logger.debug(`[/getChampionByAlias] Returning DB result: ${opts.input}`);
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

			const collection = dbh.getCollection(CollectionName.MATCH);
			const cursor = collection.aggregate(pipeline);

			const result = await cursor.toArray();

			const metadata = result[0]?.metadata || [];
			const total = metadata[0]?.total || 0;

			const maxPage = Math.ceil(total / pageSize);
			const data = (result[0]?.data || []) as MatchV5Participant[];

			logger.debug(
				`[/getMatchesParticipant] Returning DB result: ${opts.input}`,
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
			logger.debug("[/getQueues] Returning cached result");
			return cachedResult.data;
		}

		const result = await dbh.genericGet(
			CollectionName.QUEUE,
			{ limit: 1000 },
			QueueSchema,
		);
		simpleCache.set("getQueues", result);
		logger.debug("[/getQueues] Returning DB result");
		return result;
	}),
	getItems: loggedProcedure.query(async () => {
		const cachedResult = ItemSchema.array().safeParse(
			simpleCache.get("getItems"),
		);
		if (cachedResult.success) {
			logger.debug("[/getItems] Returning cached result");
			return cachedResult.data;
		}

		const results = await dbh.genericGet(
			CollectionName.ITEM,
			{ limit: 1000 },
			ItemSchema,
		);
		simpleCache.set("getItems", results);
		logger.debug("[/getItems] Returning DB result");
		return results;
	}),
	getSummonerSpells: loggedProcedure.query(async () => {
		const cachedResult = SummonerSpellSchema.array().safeParse(
			simpleCache.get("getSummonerSpells"),
		);
		if (cachedResult.success) {
			logger.debug("[/getSummonerSpells] Returning cached result");
			return cachedResult.data;
		}

		const result = await dbh.genericGet(
			CollectionName.SUMMONER_SPELL,
			{ limit: 1000 },
			SummonerSpellSchema,
		);
		simpleCache.set("getSummonerSpells", result);
		logger.debug("[/getSummonerSpells] Returning DB result");
		return result;
	}),
	getSummoners: loggedProcedure.query(async () => {
		const cachedResult = SummonerDbSchema.array().safeParse(
			simpleCache.get("getSummoners"),
		);
		if (cachedResult.success) {
			logger.debug("[/getSummoners] Returning cached result");
			return cachedResult.data;
		}

		const result = await dbh.genericGet(
			CollectionName.SUMMONER,
			{ limit: 1000 },
			SummonerDbSchema,
		);
		simpleCache.set("getSummoners", result);
		logger.debug("[/getSummoners] Returning DB result");
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
logger.info("tRPC Server is running on http://localhost:3000/trpc");

export type AppRouter = typeof appRouter;
