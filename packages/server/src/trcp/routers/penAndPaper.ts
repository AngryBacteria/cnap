import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";
import { db } from "../../db/index.js";
import {
	frameworkEnum,
	PEN_AND_PAPER_SESSION_TABLE,
	PEN_AND_PAPER_SESSION_TABLE_UPDATE_SCHEMA,
} from "../../db/schemas/index.js";
import { to, verifyAdminPassword } from "../../helpers/General.js";
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
				cause: error,
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
		return {
			...session,
			frameworkOptions: frameworkEnum.enumValues,
		};
	}),
	getSessions: loggedProcedure.query(async () => {
		const [sessions, error] = await to(
			db.query.PEN_AND_PAPER_SESSION_TABLE.findMany({
				orderBy: (sessions, { desc }) => [desc(sessions.timestamp)],
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
				cause: error,
			});
		}

		logger.debug("API:getSessions - fetched sessions from db");
		return sessions;
	}),
	updateSession: loggedProcedure
		.input(
			z.object({
				sessionId: z.number(),
				password: z.string(),
				data: PEN_AND_PAPER_SESSION_TABLE_UPDATE_SCHEMA.omit({
					id: true,
					dmMemberGameName: true,
					transcriptions: true,
					goals: true,
				}),
			}),
		)
		.mutation(async (opts) => {
			const { sessionId, data, password } = opts.input;

			if (!verifyAdminPassword(password)) {
				logger.error(
					{ code: 401, sessionId },
					"API:updateSession - unauthorized attempt to update session",
				);
				throw new TRPCError({
					message: "Unauthorized: Invalid admin password",
					code: "UNAUTHORIZED",
				});
			}

			const [updatedSession, error] = await to(
				db
					.update(PEN_AND_PAPER_SESSION_TABLE)
					.set(data)
					.where(eq(PEN_AND_PAPER_SESSION_TABLE.id, sessionId)),
			);

			if (error) {
				logger.error(
					{ err: error, code: 500, sessionId: sessionId },
					"API:updateSession - failed to update session in db",
				);
				throw new TRPCError({
					message: `Session update failed: ${error.message}`,
					code: "INTERNAL_SERVER_ERROR",
					cause: error,
				});
			}

			if (!updatedSession?.rowCount) {
				logger.error(
					{ code: 404, sessionId: sessionId },
					"API:updateSession - session not found in db",
				);
				throw new TRPCError({
					message: `Session with id ${sessionId} not found`,
					code: "NOT_FOUND",
				});
			}

			logger.debug(
				{ sessionId: sessionId },
				"API:updateSession - session updated",
			);
			return true;
		}),
});
