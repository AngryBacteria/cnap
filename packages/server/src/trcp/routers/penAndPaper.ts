import { z } from "zod";
import dbh from "../../helpers/DBHelper.js";
import { CollectionName, type MongoPipeline } from "../../model/Database.js";
import { PenAndPaperSessionSchema } from "../../model/PenAndPaper.js";
import { loggedProcedure } from "../middlewares/executionTime.js";
import { router } from "../trcp.js";

export const penAndPaperRouter = router({
	getSessions: loggedProcedure
		.input(
			z.object({
				campaign: z.string().nullish(),
				dmGameName: z.string().nullish(),
				playerGameName: z.string().nullish(),
			}),
		)
		.query(async (opts) => {
			const pipeline: MongoPipeline = [];

			// Initial filters
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
			// Filters after lookup
			if (opts.input.dmGameName) {
				pipeline.push({
					$match: {
						"dm.gameName": { $regex: opts.input.dmGameName, $options: "i" },
					},
				});
			}
			if (opts.input.playerGameName) {
				pipeline.push({
					$match: {
						"players.gameName": {
							$regex: opts.input.playerGameName,
							$options: "i",
						},
					},
				});
			}

			const sessionResponse = await dbh.genericPipeline(
				pipeline,
				CollectionName.SESSION,
				PenAndPaperSessionSchema,
			);
			return sessionResponse.data;
		}),
});
