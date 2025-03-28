import { z } from "zod";
import dbh from "../../helpers/DBHelper.js";
import { CollectionName } from "../../model/Database.js";
import { SessionSchema } from "../../model/Session.js";
import { loggedProcedure } from "../middlewares/executionTime.js";
import { router } from "../trcp.js";

export const penAndPaperRouter = router({
	getSessions: loggedProcedure
		.input(
			z.object({
				campaign: z.string().nullish(),
			}),
		)
		.query(async (opts) => {
			const pipeline: Record<string, unknown>[] = [];
			// Filter
			if (opts.input.campaign) {
				pipeline.push({
					$match: {
						campaignId: opts.input.campaign,
					},
				});
			}

			// Lookup relationships
			pipeline.push({
				$lookup: {
					from: "member",
					localField: "dmId",
					foreignField: "_id",
					as: "dm",
				},
			});
			pipeline.push({ $unwind: { path: "$dm" } });
			pipeline.push({
				$lookup: {
					from: "member",
					localField: "playerIds",
					foreignField: "_id",
					as: "players",
				},
			});
			// Project into right format
			pipeline.push({ $project: { playerIds: 0, dmId: 0 } });

			const sessionResponse = await dbh.genericPipeline(
				pipeline,
				CollectionName.SESSION,
				SessionSchema,
			);
			return sessionResponse.data;
		}),
});
