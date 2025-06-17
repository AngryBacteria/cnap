import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { db, testDBConnection } from "../../db/index.js";
import { to } from "../../helpers/General.js";
import logger from "../../helpers/Logger.js";
import { loggedProcedure } from "../middlewares/executionTime.js";
import { router } from "../trcp.js";

// Test database connection
await testDBConnection();

export const generalRouter = router({
	getServerTime: loggedProcedure.query(async () => {
		return new Date();
	}),
	getMembers: loggedProcedure
		.input(
			z.object({
				onlyCore: z.boolean().optional().default(true),
			}),
		)
		.query(async (opts) => {
			const [data, error] = await to(
				db.query.MEMBERS_TABLE.findMany({
					where: opts.input.onlyCore
						? (members, { eq }) => eq(members.core, true)
						: undefined,
					with: {
						leagueSummoners: true,
					},
				}),
			);

			if (error) {
				logger.error(
					{ err: error },
					"API:getMembers - Failed to fetch members from Database",
				);
				throw new TRPCError({
					message: "Failed to fetch members from Database",
					code: "INTERNAL_SERVER_ERROR",
				});
			}

			if (data.length === 0) {
				logger.warn("API:getMembers - No members found in Database");
				throw new TRPCError({
					message: "No members found in the database",
					code: "NOT_FOUND",
				});
			}

			logger.debug("API:getMembers - returned members");
			return data;
		}),
});
