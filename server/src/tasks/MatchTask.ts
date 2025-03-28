import dbh from "../helpers/DBHelper.js";
import logger from "../helpers/Logger.js";
import rh from "../helpers/RiotHelper.js";
import { CollectionName } from "../model/Database.js";
import { SummonerDbSchema } from "../model/Summoner.js";

export class MatchTask {
	async updateMatchData(count = 69, offset = 0, puuid = ""): Promise<void> {
		// Optionally filter by puuid
		const summonerResponse = await dbh.genericGet(
			CollectionName.SUMMONER,
			{ limit: 100000, filter: puuid ? { puuid } : undefined },
			SummonerDbSchema,
		);

		if (!summonerResponse.success || summonerResponse.data.length === 0) {
			logger.warn(
				{ count, offset, puuid },
				"Task:updateMatchData No Summoner data available to update match history. Stopping the task",
			);
			return;
		}

		for (const summoner of summonerResponse.data) {
			const riotMatchIds = await rh.getMatchList(summoner.puuid, count, offset);

			const filteredMatchIds = (
				await dbh.getNonExistingIds(
					riotMatchIds,
					CollectionName.MATCH,
					"metadata.matchId",
				)
			).data;

			const filteredTimelineIds = (
				await dbh.getNonExistingIds(
					riotMatchIds,
					CollectionName.TIMELINE,
					"metadata.matchId",
				)
			).data;

			const matchData = [];
			for (const matchId of filteredMatchIds) {
				const match = await rh.getMatch(matchId);
				if (match) {
					matchData.push(match);
				}
			}

			if (matchData && matchData.length > 0) {
				await dbh.genericUpsert(
					matchData,
					"metadata.matchId",
					CollectionName.MATCH,
					undefined,
				);
			}

			const timelineData = [];
			for (const timelineId of filteredTimelineIds) {
				const timeline = await rh.getTimeline(timelineId);
				if (timeline) {
					timelineData.push(timeline);
				}
			}

			if (timelineData && timelineData.length > 0) {
				await dbh.genericUpsert(
					timelineData,
					"metadata.matchId",
					CollectionName.TIMELINE,
					undefined,
				);
			}

			logger.debug(
				{ puuid: summoner.puuid },
				"Task:updateMatchData Updated match",
			);
		}

		logger.debug(
			{ count, offset, puuid, amountUpdated: summonerResponse.data.length },
			"Task:updateMatchData Updated match data summoners",
		);
	}

	async fillMatchData(puuid: string) {
		logger.debug({ puuid }, "Task:fillMatchData Starting to fill match data");
		for (let i = 0; i < 2000; i += 69) {
			await this.updateMatchData(69, i, puuid);
		}
		logger.debug({ puuid }, "Task:fillMatchData Finished filling match data");
	}
}

export default new MatchTask();
