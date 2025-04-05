import dbh from "../../helpers/DBHelper.js";
import logger from "../../helpers/Logger.js";
import { CollectionName, type MongoPipeline } from "../../model/Database.js";
import { PenAndPaperSessionSchema } from "../../model/PenAndPaper.js";
import { loggedProcedure } from "../middlewares/executionTime.js";
import { router } from "../trcp.js";

export const penAndPaperRouter = router({
	getSessions: loggedProcedure.query(async () => {
		const pipeline: MongoPipeline = [
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
		];
		const sessionResponse = await dbh.genericPipeline(
			pipeline,
			CollectionName.PEN_AND_PAPER_SESSION,
			PenAndPaperSessionSchema,
		);
		if (!sessionResponse.success) {
			throw new Error("Sessions couldn't be fetched");
		}
		logger.info("API:getSessions");
		return sessionResponse.data;
	}),
});
