import { inArray } from "drizzle-orm";
import { db } from "../db/index.js";
import {
	LEAGUE_MATCHES_TABLE,
	LEAGUE_MATCH_PARTICIPANTS_TABLE,
	LEAGUE_TIMELINES_TABLE,
} from "../db/schemas/index.js";
import logger from "../helpers/Logger.js";
import { to } from "../helpers/Promises.js";
import rh from "../helpers/RiotHelper.js";
import type { MatchV5DB } from "../model/MatchV5.js";

//TODO migrate

export class MatchTask {
	async updateMatchData(count = 69, offset = 0): Promise<void> {
		const [summonersData, summonersError] = await to(
			db.query.LEAGUE_SUMMONERS_TABLE.findMany(),
		);
		if (summonersError) {
			logger.error(
				{ err: summonersError, count, offset },
				"Task:updateMatchData Error fetching summoners from database. Stopping the task",
			);
			return;
		}
		if (summonersData.length === 0) {
			logger.warn(
				{ count, offset },
				"Task:updateMatchData No Summoner data available to update match history. Stopping the task",
			);
			return;
		}

		for (const summoner of summonersData) {
			// Find matchIds that do not exist in the database
			const riotMatchIds = await rh.getMatchList(summoner.puuid, count, offset);
			const existingMatches = await db
				.select({ matchId: LEAGUE_MATCHES_TABLE.matchId })
				.from(LEAGUE_MATCHES_TABLE)
				.where(inArray(LEAGUE_MATCHES_TABLE.matchId, riotMatchIds));
			const existingDBMatchIds = existingMatches.map((m) => m.matchId);
			const nonExistingDBMatchIds = riotMatchIds.filter(
				(id) => !existingDBMatchIds.includes(id),
			);

			// Get match data for non-existing matches
			const matchData: MatchV5DB[] = [];
			for (const matchId of nonExistingDBMatchIds) {
				const match = await rh.getMatch(matchId);
				if (match) {
					matchData.push(match);
				}
			}

			// Add new matches, timelines and match-participants to the database
			await this.addMatchesToDB(matchData, summoner.puuid);
			await this.addMatchParticipantsToDB(matchData, summoner.puuid);
			await this.addTimelinesToDB(nonExistingDBMatchIds, summoner.puuid);

			logger.debug(
				{
					puuid: summoner.puuid,
					totalMatchIds: riotMatchIds.length,
					nonExistingMatchIds: nonExistingDBMatchIds.length,
				},
				"Task:updateMatchData Updated match data for summoner",
			);
		}

		logger.debug(
			{ count, offset, amountOfSummonersUpdated: summonersData.length },
			"Task:updateMatchData Updated match data summoners",
		);
	}

	async addMatchesToDB(matches: MatchV5DB[], puuid: string): Promise<void> {
		if (matches.length === 0) {
			logger.debug(
				{ puuid },
				"Task:addMatchesToDB No matches to add to the database",
			);
			return;
		}

		const matchData = matches.map((match) => {
			return {
				matchId: match.metadata.matchId,
				dataVersion: match.metadata.dataVersion,
				raw: match,
			};
		});
		const [_, insertMatchError] = await to(
			db.insert(LEAGUE_MATCHES_TABLE).values(matchData),
		);
		if (insertMatchError) {
			logger.error(
				{ err: insertMatchError, puuid },
				"Task:addMatchesToDB Error inserting match data into database",
			);
		}
	}

	async addMatchParticipantsToDB(
		matches: MatchV5DB[],
		puuid: string,
	): Promise<void> {
		if (matches.length === 0) {
			logger.debug(
				{ puuid },
				"Task:addMatchParticipantsToDB No matches-participants to add to the database",
			);
			return;
		}

		const participantsData = matches.flatMap((match) => {
			return match.info.participants
				.filter((participant) => participant.puuid.toLowerCase() !== "bot")
				.map((participant) => {
					return {
						...participant,
						matchId: match.metadata.matchId,
						queueId: match.info.queueId,
						gameMode: match.info.gameMode,
						mapId: match.info.mapId,
						gameDuration: match.info.gameDuration,
						endOfGameResult: match.info.endOfGameResult,
						gameCreation: match.info.gameCreation,
						gameType: match.info.gameType,
						gameVersion: match.info.gameVersion,
						platformId: match.info.platformId,
					};
				});
		});

		if (participantsData.length > 0) {
			const [__, insertMatchParticipantError] = await to(
				db.insert(LEAGUE_MATCH_PARTICIPANTS_TABLE).values(participantsData),
			);
			if (insertMatchParticipantError) {
				logger.error(
					{ err: insertMatchParticipantError, puuid },
					"Task:addMatchParticipantsToDB Error inserting match participant data into database",
				);
			}
		}
	}

	async addTimelinesToDB(matchIds: string[], puuid: string) {
		const timelineData: (typeof LEAGUE_TIMELINES_TABLE.$inferInsert)[] = [];
		for (const matchId of matchIds) {
			const timeline = await rh.getTimeline(matchId);
			if (timeline) {
				timelineData.push({
					matchId: timeline.metadata.matchId,
					dataVersion: timeline.metadata.dataVersion,
					raw: timeline,
				});
			}
		}

		if (timelineData.length > 0) {
			const [__, insertTimelineError] = await to(
				db.insert(LEAGUE_TIMELINES_TABLE).values(timelineData),
			);
			if (insertTimelineError) {
				logger.error(
					{ err: insertTimelineError, puuid },
					"Task:addTimelinesToDB Error inserting match participant data into database",
				);
			}
		}
	}

	async fillMatchData() {
		logger.debug("Task:fillMatchData Starting to fill match data");
		for (let i = 0; i < 2000; i += 69) {
			await this.updateMatchData(69, i);
		}
		logger.debug("Task:fillMatchData Finished filling match data");
	}
}

export default new MatchTask();
