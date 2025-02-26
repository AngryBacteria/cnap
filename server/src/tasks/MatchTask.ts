import { CollectionName, DBHelper } from "../helpers/DBHelper.js";
import { RiotHelper } from "../helpers/RiotHelper.js";
import type { SummonerDb } from "../model/SummonerDb.js";

export class MatchTask {
	private db_helper: DBHelper;
	private riot_helper: RiotHelper;

	constructor() {
		this.db_helper = new DBHelper();
		this.riot_helper = new RiotHelper();
	}

	//TODO: implement method to fill db for a summoner

	async updateMatchData(count = 69, offset = 0): Promise<void> {
		const existingSummoners = await this.db_helper.genericGet<SummonerDb>(
			{ offset: 0, limit: 100000, project: {}, filter: {} },
			CollectionName.SUMMONER,
			undefined,
		);

		if (!existingSummoners || existingSummoners.length === 0) {
			console.debug(
				"No Summoner data available to update match history. Stopping the loop",
			);
			return;
		}

		for (const summoner of existingSummoners) {
			const riotMatchIds = await this.riot_helper.getMatchList(
				summoner.puuid,
				count,
				offset,
			);

			const filteredMatchIds = await this.db_helper.getNonExistingMatchIds(
				riotMatchIds,
				"MatchV5",
				"metadata.matchId",
			);

			const filteredTimelineIds = await this.db_helper.getNonExistingMatchIds(
				riotMatchIds,
				"TimelineV5",
				"metadata.matchId",
			);

			const matchData = [];
			for (const matchId of filteredMatchIds) {
				const match = await this.riot_helper.getMatch(matchId);
				if (match) {
					matchData.push(match);
				}
			}

			if (matchData && matchData.length > 0) {
				await this.db_helper.genericUpsert(
					matchData,
					"metadata.matchId",
					CollectionName.MATCH,
					"Match",
					undefined,
				);
			}

			const timelineData = [];
			for (const timelineId of filteredTimelineIds) {
				const timeline = await this.riot_helper.getTimeline(timelineId);
				if (timeline) {
					timelineData.push(timeline);
				}
			}

			if (timelineData && timelineData.length > 0) {
				await this.db_helper.genericUpsert(
					timelineData,
					"metadata.matchId",
					CollectionName.TIMELINE,
					"Timeline",
					undefined,
				);
			}
		}
	}
}
