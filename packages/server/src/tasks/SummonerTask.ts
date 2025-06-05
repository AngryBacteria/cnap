import "dotenv/config";
import { eq } from "drizzle-orm";
import { db, getAllOnConflictColumns } from "../db/index.js";
import { LEAGUE_SUMMONERS_TABLE } from "../db/schemas/Summoner.js";
import logger from "../helpers/Logger.js";
import rh from "../helpers/RiotHelper.js";

export class SummonerTask {
	/**
	 * Update the summoner data of all summoners in the summoners collection
	 */
	async updateSummonerData(puuid?: string): Promise<void> {
		try {
			// Query summoners with optional puuid filter
			const summonersQuery = puuid
				? db
						.select()
						.from(LEAGUE_SUMMONERS_TABLE)
						.where(eq(LEAGUE_SUMMONERS_TABLE.puuid, puuid))
				: db.select().from(LEAGUE_SUMMONERS_TABLE);
			const summonersData = await summonersQuery;

			const newSummoners: (typeof LEAGUE_SUMMONERS_TABLE.$inferInsert)[] = [];
			for (const summoner of summonersData) {
				const summonerRiot = await rh.getSummonerByPuuidRiot(summoner.puuid);
				if (summonerRiot) {
					newSummoners.push({
						...summonerRiot,
						memberGameName: summoner.memberGameName,
					});
				}
			}

			if (newSummoners.length === 0) {
				logger.warn(
					"Task:updateSummonerData - No Summoner data available to update summoner data. Stopping the task",
				);
				return;
			}

			await db
				.insert(LEAGUE_SUMMONERS_TABLE)
				.values(newSummoners)
				.onConflictDoUpdate({
					target: LEAGUE_SUMMONERS_TABLE.puuid,
					set: getAllOnConflictColumns(LEAGUE_SUMMONERS_TABLE, "puuid"),
				});
			logger.info("Task:updateSummonerData - Summoner data updated");
		} catch (e) {
			logger.error(
				{ err: e },
				"Task:updateSummonerData - Error while updating summoner data",
			);
			return;
		}
	}
}

export default new SummonerTask();
