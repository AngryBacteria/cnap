import { BasicFilterSchema, CollectionName } from "../helpers/DBHelper.js";
import dbh from "../helpers/DBHelper.js";
import rh from "../helpers/RiotHelper.js";
import type { SummonerDb } from "../model/SummonerDb.js";

export class MatchTask {
	async updateMatchData(count = 69, offset = 0, puuid = ""): Promise<void> {
		const existingSummoners: SummonerDb[] = [];
		if (puuid) {
			const summoner = await dbh.genericGet<SummonerDb>(
				CollectionName.SUMMONER,
				{ limit: 100000, filter: { puuid } },
				undefined,
			);
			if (summoner && summoner.length > 0) {
				existingSummoners.push(summoner[0]);
			}
		} else {
			const dbSummoners = await dbh.genericGet<SummonerDb>(
				CollectionName.SUMMONER,
				{ limit: 100000 },
				undefined,
			);
			if (dbSummoners && dbSummoners.length > 0) {
				existingSummoners.push(...dbSummoners);
			}
		}

		if (!existingSummoners || existingSummoners.length === 0) {
			console.log(
				"No Summoner data available to update match history. Stopping the loop",
			);
			return;
		}

		for (const summoner of existingSummoners) {
			const riotMatchIds = await rh.getMatchList(summoner.puuid, count, offset);

			const filteredMatchIds = await dbh.getNonExistingMatchIds(
				riotMatchIds,
				"MatchV5",
				"metadata.matchId",
			);

			const filteredTimelineIds = await dbh.getNonExistingMatchIds(
				riotMatchIds,
				"TimelineV5",
				"metadata.matchId",
			);

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
					"Match",
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
					"Timeline",
					undefined,
				);
			}
		}
	}

	async fillMatchData(puuid: string) {
		for (let i = 0; i < 2000; i += 69) {
			await this.updateMatchData(69, i, puuid);
		}
	}
}

export default new MatchTask();
