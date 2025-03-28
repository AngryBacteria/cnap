import { z } from "zod";
import dbh from "../../helpers/DBHelper.js";
import logger from "../../helpers/Logger.js";
import simpleCache from "../../helpers/SimpleCache.js";
import { CollectionName } from "../../model/Database.js";
import { MemberWithSummonerSchema } from "../../model/Member.js";
import { loggedProcedure } from "../middlewares/executionTime.js";
import { router } from "../trcp.js";

// Test database connection
await dbh.testConnection();

export const generalRouter = router({
	getServerTime: loggedProcedure.query(async () => {
		return new Date();
	}),
	getMembers: loggedProcedure
		.input(
			z.object({
				onlyCore: z.boolean(),
			}),
		)
		.query(async (opts) => {
			// Try cache
			const cachedResult = MemberWithSummonerSchema.array().safeParse(
				simpleCache.get(`getMembers[${opts.input.onlyCore}]`),
			);
			if (cachedResult.success) {
				logger.info({ cached: true }, "API:getMembers");
				return cachedResult.data;
			}

			// Try DB
			const pipeline: Record<string, unknown>[] = [];
			if (opts.input.onlyCore) {
				pipeline.push({ $match: { core: true } });
			}
			pipeline.push({
				$lookup: {
					from: "summoner",
					localField: "_id",
					foreignField: "memberId",
					as: "leagueSummoners",
				},
			});
			const memberResponse = await dbh.genericPipeline(
				pipeline,
				CollectionName.MEMBER,
				MemberWithSummonerSchema,
			);
			if (!memberResponse.success) {
				throw new Error("Members couldn't be fetched");
			}

			simpleCache.set(
				`getMembers[${opts.input.onlyCore}]`,
				memberResponse.data,
			);
			logger.info({ cached: false }, "API:getMembers");
			return memberResponse.data;
		}),
});
