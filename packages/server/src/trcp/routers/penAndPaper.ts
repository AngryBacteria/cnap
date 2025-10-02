import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";
import { db } from "../../db/index.js";
import { to } from "../../helpers/General.js";
import logger from "../../helpers/Logger.js";
import { loggedProcedure } from "../middlewares/executionTime.js";
import { router } from "../trcp.js";

export const penAndPaperRouter = router({
	getSession: loggedProcedure.input(z.number()).query(async (opts) => {
		const [session, error] = await to(
			db.query.PEN_AND_PAPER_SESSION_TABLE.findFirst({
				columns: {
					audioFileMimeType: false,
					audioFileBase64: false,
				},
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
				"API:getSession - failed to fetch sessions from db",
			);
			throw new TRPCError({
				message: `Session could not be loaded: ${error.message}`,
				code: "INTERNAL_SERVER_ERROR",
			});
		}

		if (!session) {
			logger.error(
				{ code: 404, sessionId: opts.input },
				"API:getSessions - no session found in db",
			);
			throw new TRPCError({
				message: `Session with id ${opts.input} not found`,
				code: "NOT_FOUND",
			});
		}

		logger.debug("API:getSession - fetched session from db");
		return session;
	}),
	getSessions: loggedProcedure.query(async () => {
		const [sessions, error] = await to(
			db.query.PEN_AND_PAPER_SESSION_TABLE.findMany({
				columns: {
					audioFileMimeType: false,
					audioFileBase64: false,
				},
			}),
		);
		if (error) {
			logger.error(
				{ err: error, code: 500 },
				"API:getSessions - failed to fetch sessions from db",
			);
			throw new TRPCError({
				message: `Sessions could not be loaded: ${error.message}`,
				code: "INTERNAL_SERVER_ERROR",
			});
		}

		logger.debug("API:getSessions - fetched sessions from db");
		return sessions;
	}),
});
