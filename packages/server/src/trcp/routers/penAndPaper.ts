import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";
import { db } from "../../db/index.js";
import {
	frameworkEnum,
	PEN_AND_PAPER_CHARACTER_TABLE,
	PEN_AND_PAPER_SESSION_CHARACTERS_TABLE,
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
				where: (sessions, { eq }) => eq(sessions.status, "valid"),
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
	getCharacters: loggedProcedure.query(async () => {
		const [characters, error] = await to(
			db.query.PEN_AND_PAPER_CHARACTER_TABLE.findMany(),
		);
		if (error) {
			logger.error(
				{ err: error, code: 500 },
				"API:getCharacters - failed to fetch characters from db",
			);
			throw new TRPCError({
				message: `Characters could not be loaded: ${error.message}`,
				code: "INTERNAL_SERVER_ERROR",
				cause: error,
			});
		}

		logger.debug("API:getCharacters - fetched characters from db");
		return characters;
	}),
	createCharacter: loggedProcedure
		.input(
			z.object({
				password: z.string(),
				name: z.string(),
				memberGameName: z.string(),
			}),
		)
		.mutation(async (opts) => {
			const { password, name, memberGameName } = opts.input;

			if (!verifyAdminPassword(password)) {
				logger.error(
					{ code: 401 },
					"API:createEmptySession - unauthorized attempt to create empty session",
				);
				throw new TRPCError({
					message: "Unauthorized: Invalid admin password",
					code: "UNAUTHORIZED",
				});
			}

			const [newCharacter, error] = await to(
				db
					.insert(PEN_AND_PAPER_CHARACTER_TABLE)
					.values({
						memberGameName,
						name,
					})
					.returning({ id: PEN_AND_PAPER_CHARACTER_TABLE.id }),
			);

			if (error || !newCharacter[0]?.id) {
				logger.error(
					{ err: error, code: 500 },
					"API:createCharacter - failed to create character in db",
				);
				throw new TRPCError({
					message: `Character could not be created`,
					code: "INTERNAL_SERVER_ERROR",
					cause: error,
				});
			}

			return newCharacter[0].id;
		}),
	createEmptySession: loggedProcedure
		.input(
			z.object({
				password: z.string(),
				dmMemberGameName: z.string(),
			}),
		)
		.mutation(async (opts) => {
			const { password, dmMemberGameName } = opts.input;

			if (!verifyAdminPassword(password)) {
				logger.error(
					{ code: 401 },
					"API:createEmptySession - unauthorized attempt to create empty session",
				);
				throw new TRPCError({
					message: "Unauthorized: Invalid admin password",
					code: "UNAUTHORIZED",
				});
			}

			const date = new Date();

			const [newSession, error] = await to(
				db
					.insert(PEN_AND_PAPER_SESSION_TABLE)
					.values({
						sessionName: `Session from ${date.toISOString()}`,
						campaign: "",
						dmMemberGameName,
						framework: "DND (2024)",
						goals: [],
						summaryLong: "",
						summaryShort: "",
						transcription: "",
						audioFileBase64: null,
						audioFileMimeType: null,
						timestamp: new Date(),
						status: "draft",
					})
					.returning({ id: PEN_AND_PAPER_SESSION_TABLE.id }),
			);

			if (error) {
				logger.error(
					{ err: error, code: 500 },
					"API:createEmptySession - failed to create empty session in db",
				);
				throw new TRPCError({
					message: `Empty session could not be created: ${error.message}`,
					code: "INTERNAL_SERVER_ERROR",
					cause: error,
				});
			}
			if (!newSession[0]?.id) {
				logger.error(
					{ code: 500 },
					"API:createEmptySession - no session id returned after creation",
				);
				throw new TRPCError({
					message: "Empty session could not be created",
					code: "INTERNAL_SERVER_ERROR",
				});
			}

			logger.debug(
				{ sessionId: newSession[0].id },
				"API:createEmptySession - created empty session in db",
			);
			return newSession[0].id;
		}),
	updateSession: loggedProcedure
		.input(
			z.object({
				sessionId: z.number(),
				password: z.string(),
				data: PEN_AND_PAPER_SESSION_TABLE_UPDATE_SCHEMA.omit({
					id: true,
				})
					.required()
					.extend({
						characterIds: z.array(z.number()),
						audioFileBase64: z.string().nullish(),
						audioFileMimeType: z.string().nullish(),
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

			const [, txError] = await to(
				db.transaction(async (tx) => {
					// Update session data
					await tx
						.update(PEN_AND_PAPER_SESSION_TABLE)
						.set(data)
						.where(eq(PEN_AND_PAPER_SESSION_TABLE.id, sessionId));

					// Delete existing character-session connections
					await tx
						.delete(PEN_AND_PAPER_SESSION_CHARACTERS_TABLE)
						.where(
							eq(PEN_AND_PAPER_SESSION_CHARACTERS_TABLE.sessionId, sessionId),
						);

					// Insert new character-session connections
					const characterConnections = data.characterIds.map((charId) => ({
						sessionId: sessionId,
						characterId: charId,
					}));
					await tx
						.insert(PEN_AND_PAPER_SESSION_CHARACTERS_TABLE)
						.values(characterConnections);
				}),
			);

			if (txError) {
				logger.error(
					{ err: txError, code: 500, sessionId: sessionId },
					"API:updateSession - failed to update session in db",
				);
				throw new TRPCError({
					message: `Session update failed: ${txError.message}`,
					code: "INTERNAL_SERVER_ERROR",
					cause: txError,
				});
			}

			logger.debug(
				{ sessionId: sessionId },
				"API:updateSession - session updated",
			);
			return true;
		}),
});
