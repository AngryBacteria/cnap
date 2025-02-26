import { CollectionName } from "../helpers/DBHelper.js";
import rh  from "../helpers/RiotHelper.js";
import dbh from "../helpers/DBHelper.js";


export class GameDataTask {
	async updateChampions(): Promise<void> {
		const champions = await rh.getChampions();
		if (champions.length <= 0) {
			console.error("No champions found in CDN response");
		} else {
			await dbh.genericUpsert(
				champions,
				"id",
				CollectionName.CHAMPION,
				"champion",
				undefined,
			);
			console.log("Champions updated");
		}
	}

	async updateGameModes(): Promise<void> {
		const gameModes = await rh.getGameModes();
		if (gameModes.length <= 0) {
			console.error("No game modes found in CDN response");
		} else {
			await dbh.genericUpsert(
				gameModes,
				"gameMode",
				CollectionName.GAME_MODE,
				"game mode",
				undefined,
			);
			console.log("Game modes updated");
		}
	}

	async updateGameTypes(): Promise<void> {
		const gameTypes = await rh.getGameTypes();
		if (gameTypes.length <= 0) {
			console.error("No game types found in CDN response");
		} else {
			await dbh.genericUpsert(
				gameTypes,
				"gametype",
				CollectionName.GAME_TYPE,
				"game type",
				undefined,
			);
			console.log("Game types updated");
		}
	}

	async updateItems(): Promise<void> {
		const items = await rh.getItems();
		if (items.length <= 0) {
			console.error("No items found in CDN response");
		} else {
			await dbh.genericUpsert(
				items,
				"id",
				CollectionName.ITEM,
				"Item",
				undefined,
			);
			console.log("Items updated");
		}
	}

	async updateMaps(): Promise<void> {
		const maps = await rh.getMaps();
		if (maps.length <= 0) {
			console.error("No maps found in CDN response");
		} else {
			await dbh.genericUpsert(
				maps,
				"mapId",
				CollectionName.MAP,
				"map",
				undefined,
			);
			console.log("Maps updated");
		}
	}

	async updateQueues(): Promise<void> {
		const queues = await rh.getQueues();
		if (queues.length <= 0) {
			console.error("No queues found in CDN response");
		} else {
			await dbh.genericUpsert(
				queues,
				"queueId",
				CollectionName.QUEUE,
				"queue",
				undefined,
			);
			console.log("Queues updated");
		}
	}

	async updateSummonerIcons(): Promise<void> {
		const summonerIcons = await rh.getSummonerIcons();
		if (summonerIcons.length <= 0) {
			console.error("No summoner icons found in CDN response");
		} else {
			await dbh.genericUpsert(
				summonerIcons,
				"id",
				CollectionName.SUMMONER_ICON,
				"summoner_icon",
				undefined,
			);
			console.log("Summoner icons updated");
		}
	}

	async updateSummonerSpells(): Promise<void> {
		const summonerSpells = await rh.getSummonerSpells();
		if (summonerSpells.length <= 0) {
			console.error("No summoner spells found in CDN response");
		} else {
			await dbh.genericUpsert(
				summonerSpells,
				"id",
				CollectionName.SUMMONER_SPELL,
				"summoner_spell",
				undefined,
			);
			console.log("Summoner spells updated");
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

		console.log("All game data updated");
	}
}

export default new GameDataTask();