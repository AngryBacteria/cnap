import { BasicFilterSchema, CollectionName } from "../helpers/DBHelper.js";
import "dotenv/config";
import { z } from "zod";
import dbh from "../helpers/DBHelper.js";
import logger from "../helpers/Logger.js";
import rh from "../helpers/RiotHelper.js";
import { type SummonerDb } from "src/model/Summoner.js";
import { SummonerDbSchema } from "src/model/Summoner.js";

export class SummonerTask {
	private accountsString: string;

	constructor() {
		this.accountsString =
			"AngryBacteria_cnap,BriBri_0699,VerniHD_EUW,Baywack_CnAP,3 6 6 1_#EUW,SignisAura_CnAP,Alraune22_CnAP,Aw3s0m3mag1c_EUW,Gnerfedurf_BCH,Gnoblin_BCH,VredVampire_2503,D3M0NK1LL3RG0D_EUW,GLOMVE_EUW,hide on büschli_EUW,IBlueSnow_EUW,Nayan Stocker_EUW,Norina Michel_EUW,pentaskill_CnAP,Pollux_2910,Polylinux_EUW,Prequ_EUW,Sausage Revolver_EUW,swiss egirI_EUW,TCT Tawan_EUW,The 26th Bam_EUW,Theera3rd_EUW,Zinsstro_EUW,WhatThePlay_CnAP,pentaskill_CnAP,Árexo_CNAP,Naaji_EUW,6c51o_6C51";

		if (process.env.ACCOUNTS_STRING) {
			this.accountsString = z.string().parse(process.env.ACCOUNTS_STRING);
		}
	}

	/**
	 * Fill the summoners collection with the accounts provided in the environment variable ACCOUNTS_STRING
	 */
	async fillSummoners(): Promise<void> {
		const accountsStringSeparated = this.accountsString.split(",");
		const summonerObjects: SummonerDb[] = [];

		for (const account of accountsStringSeparated) {
			const parts = account.trim().split("_");

			if (parts.length > 1) {
				const name = parts[0];
				const tag = parts[1];

				const summonerData = await rh.getSummonerByAccountTag(name, tag);

				if (summonerData) {
					summonerObjects.push(summonerData);
				}
			} else {
				logger.error(
					{ accountString: account },
					"Task:fillSummoners - Account string is not valid, skipping it",
				);
			}
		}

		await dbh.genericUpsert(
			summonerObjects,
			"puuid",
			CollectionName.SUMMONER,
			undefined,
		);

		logger.debug("Task:fillSummoners - Database filled with summoners");
	}

	/**
	 * Add a single summoner to the summoners collection
	 */
	async addSummoner(name: string, tag: string, puuid?: string): Promise<void> {
		let summonerData: SummonerDb | null = null;

		if (puuid) {
			summonerData = await rh.getSummonerByPuuidRiot(puuid);
		} else {
			summonerData = await rh.getSummonerByAccountTag(name, tag);
		}

		if (summonerData) {
			await dbh.genericUpsert(
				[summonerData],
				"puuid",
				CollectionName.SUMMONER,
				undefined,
			);

			logger.debug(
				{ name, tag },
				"Task:addSummoner - Summoner added to the database",
			);
		} else {
			throw new Error("Summoner not found");
		}
	}

	/**
	 * Update the summoner data of all summoners in the summoners collection
	 */
	async updateSummonerData(): Promise<void> {
		const existingSummoners = await dbh.genericGet<SummonerDb>(
			CollectionName.SUMMONER,
			{ limit: 100000 },
			SummonerDbSchema,
		);

		if (existingSummoners && existingSummoners.length > 0) {
			const newSummoners: SummonerDb[] = [];

			for (const summoner of existingSummoners) {
				const summonerRiot = await rh.getSummonerByPuuidRiot(summoner.puuid);

				if (summonerRiot) {
					newSummoners.push(summonerRiot);
				}
			}

			await dbh.genericUpsert(
				newSummoners,
				"puuid",
				CollectionName.SUMMONER,
				undefined,
			);

			logger.debug("Task:updateSummonerData - Summoner data updated");
		} else {
			logger.warn(
				"Task:updateSummonerData - No summoners found in the database, skipping update",
			);
		}
	}
}

export default new SummonerTask();
