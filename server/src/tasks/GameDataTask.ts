import dbh from "../helpers/DBHelper.js";
import logger from "../helpers/Logger.js";
import rh from "../helpers/RiotHelper.js";
import { ChampionSchema } from "../model/Champion.js";
import { CollectionName } from "../model/Database.js";
import { GameModeSchema } from "../model/GameMode.js";
import { GameTypeSchema } from "../model/GameType.js";
import { ItemSchema } from "../model/Item.js";
import { LeagueMapSchema } from "../model/Map.js";
import { QueueSchema } from "../model/Queue.js";
import { SummonerIconSchema } from "../model/SummonerIcon.js";
import { SummonerSpellSchema } from "../model/SummonerSpell.js";

export class GameDataTask {
	async updateChampions(): Promise<void> {
		const champions = await rh.getChampions();
		if (champions.length <= 0) {
			logger.error("Task:updateChampions - No champions found in CDN response");
		} else {
			await dbh.genericUpsert(
				champions,
				"id",
				CollectionName.CHAMPION,
				ChampionSchema,
			);
			logger.debug("Task:updateChampions - Champions updated");
		}
	}

	async updateGameModes(): Promise<void> {
		const gameModes = await rh.getGameModes();
		if (gameModes.length <= 0) {
			logger.error(
				"Task:updateGameModes - No game modes found in CDN response",
			);
		} else {
			await dbh.genericUpsert(
				gameModes,
				"gameMode",
				CollectionName.GAME_MODE,
				GameModeSchema,
			);
			logger.debug("Task:updateGameModes - Game modes updated");
		}
	}

	async updateGameTypes(): Promise<void> {
		const gameTypes = await rh.getGameTypes();
		if (gameTypes.length <= 0) {
			logger.error(
				"Task:updateGameTypes - No game types found in CDN response",
			);
		} else {
			await dbh.genericUpsert(
				gameTypes,
				"gametype",
				CollectionName.GAME_TYPE,
				GameTypeSchema,
			);
			logger.debug("Task:updateGameTypes - Game types updated");
		}
	}

	async updateItems(): Promise<void> {
		const items = await rh.getItems();
		if (items.length <= 0) {
			logger.error("Task:updateItems - No items found in CDN response");
		} else {
			await dbh.genericUpsert(items, "id", CollectionName.ITEM, ItemSchema);
			logger.debug("Task:updateItems - Items updated");
		}
	}

	async updateMaps(): Promise<void> {
		const maps = await rh.getMaps();
		if (maps.length <= 0) {
			logger.error("Task:updateMaps - No maps found in CDN response");
		} else {
			await dbh.genericUpsert(
				maps,
				"mapId",
				CollectionName.MAP,
				LeagueMapSchema,
			);
			logger.debug("Task:updateMaps - Maps updated");
		}
	}

	async updateQueues(): Promise<void> {
		const queues = await rh.getQueues();
		if (queues.length <= 0) {
			logger.error("Task:updateQueues - No queues found in CDN response");
		} else {
			await dbh.genericUpsert(
				queues,
				"queueId",
				CollectionName.QUEUE,
				QueueSchema,
			);
			logger.debug("Task:updateQueues - Queues updated");
		}
	}

	async updateSummonerIcons(): Promise<void> {
		const summonerIcons = await rh.getSummonerIcons();
		if (summonerIcons.length <= 0) {
			logger.error(
				"Task:updateSummonerIcons - No summoner icons found in CDN response",
			);
		} else {
			await dbh.genericUpsert(
				summonerIcons,
				"id",
				CollectionName.SUMMONER_ICON,
				SummonerIconSchema,
			);
			logger.debug("Task:updateSummonerIcons - Summoner icons updated");
		}
	}

	async updateSummonerSpells(): Promise<void> {
		const summonerSpells = await rh.getSummonerSpells();
		if (summonerSpells.length <= 0) {
			logger.error(
				"Task:updateSummonerSpells - No summoner spells found in CDN response",
			);
		} else {
			await dbh.genericUpsert(
				summonerSpells,
				"id",
				CollectionName.SUMMONER_SPELL,
				SummonerSpellSchema,
			);
			logger.debug("Task:updateSummonerSpells - Summoner spells updated");
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

		logger.debug("Task:updateEverything - All game data updated");
	}
}

export default new GameDataTask();
