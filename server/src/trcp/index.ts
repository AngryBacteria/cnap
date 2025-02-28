import fs from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import express from "express";
import { z } from "zod";
import dbh, { CollectionName } from "../helpers/DBHelper.js";
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
		return await dbh.genericGet(
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
			throw new Error("Champion not found");
		}
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
				if (summonerPuuids.length === 0) {
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
				}
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

			return {
				page,
				maxPage,
				data,
			};
		}),
	getQueues: loggedProcedure.query(async () => {
		return await dbh.genericGet(
			CollectionName.QUEUE,
			{ limit: 1000 },
			QueueSchema,
		);
	}),
	getItems: loggedProcedure.query(async () => {
		return await dbh.genericGet(
			CollectionName.ITEM,
			{ limit: 1000 },
			ItemSchema,
		);
	}),
	getSummonerSpells: loggedProcedure.query(async () => {
		return await dbh.genericGet(
			CollectionName.SUMMONER_SPELL,
			{ limit: 1000 },
			SummonerSpellSchema,
		);
	}),
	getSummoners: loggedProcedure.query(async () => {
		return await dbh.genericGet(
			CollectionName.SUMMONER,
			{ limit: 1000 },
			SummonerDbSchema,
		);
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
console.log("TRCP Server is running on http://localhost:3000/trpc");

export type AppRouter = typeof appRouter;
