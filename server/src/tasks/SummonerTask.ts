import { CollectionName } from "../model/Database.js";
import "dotenv/config";
import dbh from "../helpers/DBHelper.js";
import logger from "../helpers/Logger.js";
import rh from "../helpers/RiotHelper.js";
import { type Member, MemberSchema } from "../model/Member.js";
import type { SummonerDb } from "../model/Summoner.js";

export class SummonerTask {
	/**
	 * Update the summoner data of all summoners in the summoners collection
	 */
	async updateSummonerData(puuid?: string): Promise<void> {
		const membersResponse = await dbh.genericGet<Member>(
			CollectionName.MEMBER,
			{
				limit: 100000,
				filter: puuid ? { "leagueSummoners.puuid": puuid } : undefined,
			},
			MemberSchema,
		);

		if (!membersResponse.success) {
			logger.error(
				{ error: membersResponse.error },
				"Task:updateSummonerData - No Summoner data available to update summoner data. Stopping the task",
			);
			return;
		}

		const newMembers: Member[] = [];
		for (const member of membersResponse.data) {
			const newSummoners: SummonerDb[] = [];
			for (const summoner of member.leagueSummoners) {
				const summonerRiot = await rh.getSummonerByPuuidRiot(summoner.puuid);
				if (summonerRiot) {
					newSummoners.push(summonerRiot);
				}
			}
			newMembers.push({
				...member,
				leagueSummoners: newSummoners,
			});
		}
		await dbh.genericUpsert(
			newMembers,
			"gameName",
			CollectionName.MEMBER,
			MemberSchema,
		);
		logger.debug("Task:updateSummonerData - Summoner data updated");
	}
}

export default new SummonerTask();
