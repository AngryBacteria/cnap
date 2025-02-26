import { CollectionName, DBHelper } from "../helpers/DBHelper.js";
import { RiotHelper } from "../helpers/RiotHelper.js";
import "dotenv/config";
import { z } from "zod";
import { type SummonerDb, SummonerDbSchema } from "../model/SummonerDb.js";

export class SummonerTask {
	private dbHelper: DBHelper;
	private riotHelper: RiotHelper;
	private accountsString: string;

	constructor() {
		this.dbHelper = new DBHelper();
		this.riotHelper = new RiotHelper();
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

				const summonerData = await this.riotHelper.getSummonerByAccountTag(
					name,
					tag,
				);

				if (summonerData !== null) {
					summonerObjects.push(summonerData);
				}
			} else {
				console.error(`Account ${account} is not valid, skipping it...`);
			}
		}

		await this.dbHelper.genericUpsert(
			summonerObjects,
			"puuid",
			CollectionName.SUMMONER,
			"summoner",
			undefined,
		);
	}

	/**
	 * Add a single summoner to the summoners collection
	 */
	async addSummoner(name: string, tag: string, puuid?: string): Promise<void> {
		let summonerData: SummonerDb | null = null;

		if (puuid) {
			summonerData = await this.riotHelper.getSummonerByPuuidRiot(puuid);
		} else {
			summonerData = await this.riotHelper.getSummonerByAccountTag(name, tag);
		}

		if (summonerData !== null) {
			await this.dbHelper.genericUpsert(
				[summonerData],
				"puuid",
				CollectionName.SUMMONER,
				"summoner",
				undefined,
			);
		} else {
			throw new Error("Summoner not found");
		}
	}

	/**
	 * Update the summoner data of all summoners in the summoners collection
	 */
	async updateSummonerData(): Promise<void> {
		const existingSummoners = await this.dbHelper.genericGet<SummonerDb>(
			{ offset: 0, limit: 100000, project: {}, filter: {} },
			CollectionName.SUMMONER,
			SummonerDbSchema,
		);

		if (existingSummoners && existingSummoners.length > 0) {
			const newSummoners: SummonerDb[] = [];

			for (const summoner of existingSummoners) {
				const summonerRiot = await this.riotHelper.getSummonerByPuuidRiot(
					summoner.puuid,
				);

				if (summonerRiot) {
					newSummoners.push(summonerRiot);
				}
			}

			await this.dbHelper.genericUpsert(
				newSummoners,
				"puuid",
				CollectionName.SUMMONER,
				"summoner",
				undefined,
			);
		}
	}
}
