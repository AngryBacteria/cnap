import { z } from "zod";
import dbh from "../../helpers/DBHelper.js";
import logger from "../../helpers/Logger.js";
import simpleCache from "../../helpers/SimpleCache.js";
import { CollectionName } from "../../model/Database.js";
import { MemberSchema } from "../../model/Member.js";
import { loggedProcedure } from "../middlewares/executionTime.js";
import { router } from "../trcp.js";

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
			const cachedResult = MemberSchema.array().safeParse(
				simpleCache.get(`getMembers[${opts.input.onlyCore}]`),
			);
			if (cachedResult.success) {
				logger.info({ cached: true }, "API:getMembers");
				return cachedResult.data;
			}

			// Try DB
			const filter: Record<string, unknown> = {};
			if (opts.input.onlyCore) {
				filter.core = true;
			}
			const result = await dbh.genericGet(
				CollectionName.MEMBER,
				{ limit: 10000, filter },
				MemberSchema,
			);
			if (!result.success) {
				throw new Error("Members couldn't be fetched");
			}

			simpleCache.set(`getMembers[${opts.input.onlyCore}]`, result.data);
			logger.info({ cached: false }, "API:getMembers");
			return result.data;
		}),
});
