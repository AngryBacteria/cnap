import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { db } from "../../db/index.js";
import logger from "../../helpers/Logger.js";
import { to } from "../../helpers/Promises.js";
import { loggedProcedure } from "../middlewares/executionTime.js";
import { router } from "../trcp.js";

export const penAndPaperRouter = router({
	getSession: loggedProcedure.input(z.number()).query(async (opts) => {
		const [session, error] = await to(
			db.query.PEN_AND_PAPER_SESSION_TABLE.findFirst({
				where: (sessions, { eq }) => eq(sessions.id, opts.input),
				with: {
					dm: true,
					characters: {
						with: {
							character: {
								with: {
									member: true,
								},
							},
						},
					},
				},
			}),
		);

		if (error) {
			logger.error(
				{ err: error, code: 500, sessionId: opts.input },
				"API:getSessions",
			);
			throw new TRPCError({
				message: `Sessions could not be loaded: ${error.message}`,
				code: "INTERNAL_SERVER_ERROR",
			});
		}

		if (!session) {
			logger.error(
				{ message: "Session not found", code: 404, sessionId: opts.input },
				"API:getSessions",
			);
			throw new TRPCError({
				message: `Session with id ${opts.input} not found`,
				code: "NOT_FOUND",
			});
		}

		logger.info("API:getSession");
		return session;
	}),
	getSessions: loggedProcedure.query(async () => {
		const [sessions, error] = await to(
			db.query.PEN_AND_PAPER_SESSION_TABLE.findMany(),
		);
		if (error) {
			logger.error({ err: error, code: 500 }, "API:getSessions");
			throw new TRPCError({
				message: `Sessions could not be loaded: ${error.message}`,
				code: "INTERNAL_SERVER_ERROR",
			});
		}

		logger.info("API:getSessions");
		return sessions;
	}),
});
