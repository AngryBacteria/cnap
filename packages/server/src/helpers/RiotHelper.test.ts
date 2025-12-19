import { describe, expect, test } from "vitest";
import riotHelper from "./RiotHelper.js";

const MATCH_ID = "EUW1_7084514418";
const PUUID =
	"zk1tF-l0TT1SrT9SbUmofKLT4R2gLKxzhGSyNuuxTCbmjr6dOqTCw1GcYrHoRp5DV2f5M17GMLPEFw";
const NAME = "AngryBacteria";
const TAG = "CnAP";

describe("RiotHelper API", () => {
	test("connects to Riot API", async () => {
		const isConnected = await riotHelper.testConnection();
		expect(isConnected).toBeDefined();
		expect(isConnected).toBeTruthy();
	});

	test("Match and Timeline Schemas are correct", async () => {
		const match = await riotHelper.getMatch(MATCH_ID);
		expect(match).toBeDefined();

		const timeline = await riotHelper.getTimeline(MATCH_ID);
		expect(timeline).toBeDefined();
	});

	describe("getMatchList", () => {
		test("getMatchList must be defined and have correct length", async () => {
			const list = await riotHelper.getMatchList(PUUID, 1);
			expect(list).toBeDefined();
			expect(list).toHaveLength(1);
		});

		test("getMatchList with offset and count mus tbe correct length", async () => {
			const list = await riotHelper.getMatchList(PUUID, 2, 5);
			expect(list).toBeDefined();
			expect(list.length).toBe(2);
		});

		test("getMatchList with offset and count must have different results", async () => {
			const one = await riotHelper.getMatchList(PUUID, 1);
			const two = await riotHelper.getMatchList(PUUID, 2, 5);
			expect(one[0]).not.toBe(two[0]);
		});
	});

	describe("getRiotAccountByTag getRiotAccountByPuuid getSummonerByPuuidRiot getSummonerByAccountTag", () => {
		test("fetches account by tag & region", async () => {
			const account = await riotHelper.getRiotAccountByTag(NAME, TAG);
			expect(account).toBeDefined();
			expect(account?.puuid).toEqual(PUUID);
			expect(account?.gameName).toEqual(NAME);
			expect(account?.tagLine).toEqual(TAG);
		});

		test("fetches account by PUUID", async () => {
			const account = await riotHelper.getRiotAccountByPuuid(PUUID);
			expect(account).toBeDefined();
			expect(account?.puuid).toEqual(PUUID);
		});

		test("fetches summoner by PUUID", async () => {
			const summ = await riotHelper.getSummonerByPuuidRiot(PUUID);
			expect(summ).toBeDefined();
			expect(summ?.puuid).toEqual(PUUID);
		});

		test("fetches summoner by account tag", async () => {
			const summ = await riotHelper.getSummonerByAccountTag(NAME, TAG);
			expect(summ).toBeDefined();
			expect(summ?.puuid).toEqual(PUUID);
			expect(summ?.gameName).toEqual(NAME);
			expect(summ?.tagLine).toEqual(TAG);
		});

		test("account and summoner retrieval methods should have same data", async () => {
			const account = await riotHelper.getRiotAccountByTag(NAME, TAG);
			const summ = await riotHelper.getSummonerByAccountTag(NAME, TAG);
			expect(account?.puuid).toEqual(summ?.puuid);
			expect(account?.gameName).toEqual(summ?.gameName);
			expect(account?.tagLine).toEqual(summ?.tagLine);
		});
	});

	describe("static data endpoints", () => {
		test("getItems Schemas are correct", async () => {
			const items = await riotHelper.getItems();
			expect(items[0]).toBeDefined();
		});

		test.skip(
			"getChampions Schemas are correct",
			{ timeout: 60000 },
			async () => {
				const champs = await riotHelper.getChampions();
				expect(champs[0]).toBeDefined();
			},
		);

		test("getGameModes Schemas are correct", async () => {
			const modes = await riotHelper.getGameModes();
			expect(modes[0]).toBeDefined();
		});

		test("getGameTypes Schemas are correct", async () => {
			const types = await riotHelper.getGameTypes();
			expect(types[0]).toBeDefined();
		});

		test("getMaps Schemas are correct", async () => {
			const maps = await riotHelper.getMaps();
			expect(maps[0]).toBeDefined();
		});

		test("getQueues Schemas are correct", async () => {
			const queues = await riotHelper.getQueues();
			expect(queues[0]).toBeDefined();
		});

		test("getSummonerIcons Schemas are correct", async () => {
			const icons = await riotHelper.getSummonerIcons();
			expect(icons[0]).toBeDefined();
		});

		test("getSummonerSpells Schemas are correct", async () => {
			const spells = await riotHelper.getSummonerSpells();
			expect(spells[0]).toBeDefined();
		});
	});
});
