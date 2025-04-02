import { CollectionName } from "../model/Database.js";
import "dotenv/config";
import dbh from "../helpers/DBHelper.js";
import logger from "../helpers/Logger.js";
import rh from "../helpers/RiotHelper.js";
import {
	type SummonerDb,
	SummonerDbSchema,
} from "../model/Summoner.js";

export class SummonerTask {
	/**
	 * Update the summoner data of all summoners in the summoners collection
	 */
	async updateSummonerData(puuid?: string): Promise<void> {
		const summonersResponse = await dbh.genericGet(
			CollectionName.SUMMONER,
			{
				limit: 100000,
				filter: puuid ? { puuid: puuid } : undefined,
			},
			SummonerDbSchema,
		);

		if (!summonersResponse.success) {
			logger.error(
				{ error: summonersResponse.error },
				"Task:updateSummonerData - No Summoner data available to update summoner data. Stopping the task",
			);
			return;
		}

		const newSummoners: SummonerDb[] = [];
		for (const summoner of summonersResponse.data) {
			const summonerRiot = await rh.getSummonerByPuuidRiot(summoner.puuid);
			if (summonerRiot) {
				newSummoners.push(summonerRiot);
			}
		}

		await dbh.genericUpsert(
			newSummoners,
			"gameName",
			CollectionName.SUMMONER,
			SummonerDbSchema,
		);
		logger.debug("Task:updateSummonerData - Summoner data updated");
	}
}

export default new SummonerTask();
