import { TRPCError } from "@trpc/server";
import { ObjectId } from "mongodb";
import { z } from "zod";
import dbh from "../../helpers/DBHelper.js";
import logger from "../../helpers/Logger.js";
import { CollectionName, type MongoPipeline } from "../../model/Database.js";
import { PenAndPaperSessionSchema } from "../../model/PenAndPaper.js";
import { loggedProcedure } from "../middlewares/executionTime.js";
import { router } from "../trcp.js";

const SESSION_PIPELINE: MongoPipeline = [
	{
		$lookup: {
			from: "pen_and_paper_character",
			localField: "characterMemberIds",
			foreignField: "_id",
			as: "characters",
			pipeline: [
				{
					$lookup: {
						from: "member",
						localField: "memberId",
						foreignField: "_id",
						as: "member",
					},
				},
				{ $unwind: { path: "$member" } },
			],
		},
	},
	{
		$lookup: {
			from: "member",
			localField: "dmMemberId",
			foreignField: "_id",
			as: "dm",
		},
	},
	{ $unwind: { path: "$dm" } },
	{
		$project: {
			characterMemberIds: 0,
			dmMemberId: 0,
			"characters.memberId": 0,
		},
	},
	{
		$sort: {
			timestamp: -1,
		},
	},
];

export const penAndPaperRouter = router({
	getSession: loggedProcedure.input(z.string()).query(async (opts) => {
		let pipeline = SESSION_PIPELINE;
		try {
			pipeline = [
				{
					$match: {
						_id: new ObjectId(opts.input),
					},
				},
				...SESSION_PIPELINE,
			];
		} catch (e) {
			logger.error(
				{ error: e, code: 422, objectId: opts.input },
				"API:getSessions",
			);
			throw new TRPCError({
				message: `Input id ${opts.input} is not a valid ObjectId`,
				code: "INTERNAL_SERVER_ERROR",
			});
		}

		const sessionResponse = await dbh.genericPipeline(
			pipeline,
			CollectionName.PEN_AND_PAPER_SESSION,
			PenAndPaperSessionSchema,
		);
		if (!sessionResponse.success) {
			logger.error(
				{ error: sessionResponse.error, code: 500, objectId: opts.input },
				"API:getSessions",
			);
			throw new TRPCError({
				message: `Sessions could not be loaded: ${sessionResponse.error}`,
				code: "INTERNAL_SERVER_ERROR",
			});
		}

		if (!sessionResponse.data[0]) {
			logger.error(
				{ error: "Session not found", code: 404, objectId: opts.input },
				"API:getSessions",
			);
			throw new TRPCError({
				message: `Session with id ${opts.input} not found`,
				code: "NOT_FOUND",
			});
		}

		logger.info("API:getSession");
		return sessionResponse.data[0];
	}),
	getSessions: loggedProcedure.query(async (opts) => {
		const sessionResponse = await dbh.genericPipeline(
			SESSION_PIPELINE,
			CollectionName.PEN_AND_PAPER_SESSION,
			PenAndPaperSessionSchema,
		);
		if (!sessionResponse.success) {
			logger.error(
				{ error: sessionResponse.error, code: 500 },
				"API:getSessions",
			);
			throw new TRPCError({
				message: `Sessions could not be loaded: ${sessionResponse.error}`,
				code: "INTERNAL_SERVER_ERROR",
			});
		}

		logger.info("API:getSessions");
		return sessionResponse.data;
	}),
});
