import { CollectionName, DBHelper } from "../helpers/DBHelper.js";
import { RiotHelper } from "../helpers/RiotHelper.js";

export class GameDataTask {
	private dbHelper: DBHelper;
	private riotHelper: RiotHelper;

	constructor() {
		this.dbHelper = new DBHelper();
		this.riotHelper = new RiotHelper();
	}

	async updateChampions(): Promise<void> {
		const champions = await this.riotHelper.getChampions();
		if (champions.length <= 0) {
			console.error("No champions found in CDN response");
		} else {
			await this.dbHelper.genericUpsert(
				champions,
				"id",
				CollectionName.CHAMPION,
				"champion",
				undefined,
			);
			console.debug("Champions updated");
		}
	}

	async updateGameModes(): Promise<void> {
		const gameModes = await this.riotHelper.getGameModes();
		if (gameModes.length <= 0) {
			console.error("No game modes found in CDN response");
		} else {
			await this.dbHelper.genericUpsert(
				gameModes,
				"gameMode",
				CollectionName.GAME_MODE,
				"game mode",
				undefined,
			);
			console.debug("Game modes updated");
		}
	}

	async updateGameTypes(): Promise<void> {
		const gameTypes = await this.riotHelper.getGameTypes();
		if (gameTypes.length <= 0) {
			console.error("No game types found in CDN response");
		} else {
			await this.dbHelper.genericUpsert(
				gameTypes,
				"gametype",
				CollectionName.GAME_TYPE,
				"game type",
				undefined,
			);
			console.debug("Game types updated");
		}
	}

	async updateItems(): Promise<void> {
		const items = await this.riotHelper.getItems();
		if (items.length <= 0) {
			console.error("No items found in CDN response");
		} else {
			await this.dbHelper.genericUpsert(
				items,
				"id",
				CollectionName.ITEM,
				"Item",
				undefined,
			);
			console.debug("Items updated");
		}
	}

	async updateMaps(): Promise<void> {
		const maps = await this.riotHelper.getMaps();
		if (maps.length <= 0) {
			console.error("No maps found in CDN response");
		} else {
			await this.dbHelper.genericUpsert(
				maps,
				"mapId",
				CollectionName.MAP,
				"map",
				undefined,
			);
			console.debug("Maps updated");
		}
	}

	async updateQueues(): Promise<void> {
		const queues = await this.riotHelper.getQueues();
		if (queues.length <= 0) {
			console.error("No queues found in CDN response");
		} else {
			await this.dbHelper.genericUpsert(
				queues,
				"queueId",
				CollectionName.QUEUE,
				"queue",
				undefined,
			);
			console.debug("Queues updated");
		}
	}

	async updateSummonerIcons(): Promise<void> {
		const summonerIcons = await this.riotHelper.getSummonerIcons();
		if (summonerIcons.length <= 0) {
			console.error("No summoner icons found in CDN response");
		} else {
			await this.dbHelper.genericUpsert(
				summonerIcons,
				"id",
				CollectionName.SUMMONER_ICON,
				"summoner_icon",
				undefined,
			);
			console.debug("Summoner icons updated");
		}
	}

	async updateSummonerSpells(): Promise<void> {
		const summonerSpells = await this.riotHelper.getSummonerSpells();
		if (summonerSpells.length <= 0) {
			console.error("No summoner spells found in CDN response");
		} else {
			await this.dbHelper.genericUpsert(
				summonerSpells,
				"id",
				CollectionName.SUMMONER_SPELL,
				"summoner_spell",
				undefined,
			);
			console.debug("Summoner spells updated");
		}
	}

	async updateEverything(): Promise<void> {
		await this.updateChampions();
		await this.updateGameModes();
		await this.updateGameTypes();
		await this.updateItems();
		await this.updateMaps();
		await this.updateQueues();
		await this.updateSummonerIcons();
		await this.updateSummonerSpells();

		console.debug("All game data updated");
	}
}
