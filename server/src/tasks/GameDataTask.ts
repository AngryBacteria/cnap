import { CollectionName } from "../helpers/DBHelper.js";
import dbh from "../helpers/DBHelper.js";
import logger from "../helpers/Logger.js";
import rh from "../helpers/RiotHelper.js";

export class GameDataTask {
	async updateChampions(): Promise<void> {
		const champions = await rh.getChampions();
		if (champions.length <= 0) {
			logger.error("No champions found in CDN response");
		} else {
			await dbh.genericUpsert(
				champions,
				"id",
				CollectionName.CHAMPION,
				undefined,
			);
			logger.info("Champions updated");
		}
	}

	async updateGameModes(): Promise<void> {
		const gameModes = await rh.getGameModes();
		if (gameModes.length <= 0) {
			logger.error("No game modes found in CDN response");
		} else {
			await dbh.genericUpsert(
				gameModes,
				"gameMode",
				CollectionName.GAME_MODE,
				undefined,
			);
			logger.info("Game modes updated");
		}
	}

	async updateGameTypes(): Promise<void> {
		const gameTypes = await rh.getGameTypes();
		if (gameTypes.length <= 0) {
			logger.error("No game types found in CDN response");
		} else {
			await dbh.genericUpsert(
				gameTypes,
				"gametype",
				CollectionName.GAME_TYPE,
				undefined,
			);
			logger.info("Game types updated");
		}
	}

	async updateItems(): Promise<void> {
		const items = await rh.getItems();
		if (items.length <= 0) {
			logger.error("No items found in CDN response");
		} else {
			await dbh.genericUpsert(items, "id", CollectionName.ITEM, undefined);
			logger.info("Items updated");
		}
	}

	async updateMaps(): Promise<void> {
		const maps = await rh.getMaps();
		if (maps.length <= 0) {
			logger.error("No maps found in CDN response");
		} else {
			await dbh.genericUpsert(maps, "mapId", CollectionName.MAP, undefined);
			logger.info("Maps updated");
		}
	}

	async updateQueues(): Promise<void> {
		const queues = await rh.getQueues();
		if (queues.length <= 0) {
			logger.error("No queues found in CDN response");
		} else {
			await dbh.genericUpsert(
				queues,
				"queueId",
				CollectionName.QUEUE,
				undefined,
			);
			logger.info("Queues updated");
		}
	}

	async updateSummonerIcons(): Promise<void> {
		const summonerIcons = await rh.getSummonerIcons();
		if (summonerIcons.length <= 0) {
			logger.error("No summoner icons found in CDN response");
		} else {
			await dbh.genericUpsert(
				summonerIcons,
				"id",
				CollectionName.SUMMONER_ICON,
				undefined,
			);
			logger.info("Summoner icons updated");
		}
	}

	async updateSummonerSpells(): Promise<void> {
		const summonerSpells = await rh.getSummonerSpells();
		if (summonerSpells.length <= 0) {
			logger.error("No summoner spells found in CDN response");
		} else {
			await dbh.genericUpsert(
				summonerSpells,
				"id",
				CollectionName.SUMMONER_SPELL,
				undefined,
			);
			logger.info("Summoner spells updated");
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

		logger.info("All game data updated");
	}
}

export default new GameDataTask();
