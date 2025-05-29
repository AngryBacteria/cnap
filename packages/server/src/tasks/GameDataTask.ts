import { db } from "../db/index.js";
import {
	LEAGUE_CHAMPIONS_TABLE,
	LEAGUE_CHAMPION_PASSIVES_TABLE,
	LEAGUE_CHAMPION_PLAYSTYLES_TABLE,
	LEAGUE_CHAMPION_SKINS_TABLE,
	LEAGUE_CHAMPION_SPELLS_TABLE,
	LEAGUE_CHAMPION_TACTICAL_INFO_TABLE,
} from "../db/schemas/Champion.js";
import { LEAGUE_GAME_MODES_TABLE } from "../db/schemas/GameMode.js";
import { LEAGUE_GAME_TYPES_TABLE } from "../db/schemas/GameType.js";
import { LEAGUE_ITEMS_TABLE } from "../db/schemas/Item.js";
import { LEAGUE_QUEUES_TABLE } from "../db/schemas/Queue.js";
import { LEAGUE_MAPS_TABLE } from "../db/schemas/index.js";
import { LEAGUE_SUMMONER_ICONS_TABLE } from "../db/schemas/index.js";
import { LEAGUE_SUMMONER_SPELLS_TABLE } from "../db/schemas/index.js";
import logger from "../helpers/Logger.js";
import rh from "../helpers/RiotHelper.js";

export class GameDataTask {
	async updateChampions(): Promise<void> {
		const champions = await rh.getChampions();
		if (champions.length <= 0) {
			logger.warn("Task:updateChampions - No champions found in CDN response");
			return;
		}

		try {
			await db.delete(LEAGUE_CHAMPIONS_TABLE);
			await db.delete(LEAGUE_CHAMPION_PLAYSTYLES_TABLE);
			await db.delete(LEAGUE_CHAMPION_TACTICAL_INFO_TABLE);
			await db.delete(LEAGUE_CHAMPION_SKINS_TABLE);
			await db.delete(LEAGUE_CHAMPION_PASSIVES_TABLE);
			await db.delete(LEAGUE_CHAMPION_SPELLS_TABLE);

			await db.insert(LEAGUE_CHAMPIONS_TABLE).values(champions);

			await db.insert(LEAGUE_CHAMPION_PLAYSTYLES_TABLE).values(
				champions.map((champion) => {
					return {
						championId: champion.id,
						...champion.playstyleInfo,
					};
				}),
			);

			await db.insert(LEAGUE_CHAMPION_TACTICAL_INFO_TABLE).values(
				champions.map((champion) => {
					return {
						championId: champion.id,
						...champion.tacticalInfo,
					};
				}),
			);

			await db.insert(LEAGUE_CHAMPION_SKINS_TABLE).values(
				champions.flatMap((champion) => {
					return champion.skins.map((skin) => {
						return {
							championId: champion.id,
							...skin,
						};
					});
				}),
			);

			await db.insert(LEAGUE_CHAMPION_PASSIVES_TABLE).values(
				champions.map((champion) => {
					return {
						championId: champion.id,
						...champion.passive,
					};
				}),
			);

			await db.insert(LEAGUE_CHAMPION_SPELLS_TABLE).values(
				champions.flatMap((champion) => {
					return champion.spells.map((spell) => {
						return {
							championId: champion.id,
							...spell,
						};
					});
				}),
			);

			logger.debug(
				{ amount: champions.length },
				"Task:updateChampions - Champions updated",
			);
		} catch (e) {
			logger.error(
				{ err: e },
				"Task:updateChampions - Error while updating champions",
			);
		}
	}

	async updateGameModes(): Promise<void> {
		const gameModes = await rh.getGameModes();
		if (gameModes.length <= 0) {
			logger.warn("Task:updateGameModes - No game modes found in CDN response");
			return;
		}
		try {
			await db.delete(LEAGUE_GAME_MODES_TABLE);
			await db.insert(LEAGUE_GAME_MODES_TABLE).values(gameModes);
			logger.debug(
				{ amount: gameModes.length },
				"Task:updateGameModes - Game modes updated",
			);
		} catch (e) {
			logger.error(
				{ err: e },
				"Task:updateGameModes - Error while updating game modes",
			);
		}
	}

	async updateGameTypes(): Promise<void> {
		const gameTypes = await rh.getGameTypes();
		if (gameTypes.length <= 0) {
			logger.warn("Task:updateGameTypes - No game types found in CDN response");
			return;
		}
		try {
			await db.delete(LEAGUE_GAME_TYPES_TABLE);
			await db.insert(LEAGUE_GAME_TYPES_TABLE).values(gameTypes);
			logger.debug(
				{ amount: gameTypes.length },
				"Task:updateGameTypes - Game types updated",
			);
		} catch (e) {
			logger.error(
				{ err: e },
				"Task:updateGameTypes - Error while updating game types",
			);
		}
	}

	async updateItems(): Promise<void> {
		const items = await rh.getItems();
		if (items.length <= 0) {
			logger.warn("Task:updateItems - No items found in CDN response");
			return;
		}
		try {
			await db.delete(LEAGUE_ITEMS_TABLE);
			await db.insert(LEAGUE_ITEMS_TABLE).values(items);
			logger.debug(
				{ amount: items.length },
				"Task:updateItems - Items updated",
			);
		} catch (e) {
			logger.error({ err: e }, "Task:updateItems - Error while updating items");
		}
	}

	async updateMaps(): Promise<void> {
		const maps = await rh.getMaps();
		if (maps.length <= 0) {
			logger.warn("Task:updateMaps - No maps found in CDN response");
			return;
		}
		try {
			await db.delete(LEAGUE_MAPS_TABLE);
			await db.insert(LEAGUE_MAPS_TABLE).values(maps);
			logger.debug({ amount: maps.length }, "Task:updateMaps - Maps updated");
		} catch (e) {
			logger.error({ err: e }, "Task:updateMaps - Error while updating maps");
		}
	}

	async updateQueues(): Promise<void> {
		const queues = await rh.getQueues();
		if (queues.length <= 0) {
			logger.warn("Task:updateQueues - No queues found in CDN response");
			return;
		}
		try {
			await db.delete(LEAGUE_QUEUES_TABLE);
			await db.insert(LEAGUE_QUEUES_TABLE).values(queues);
			logger.debug(
				{ amount: queues.length },
				"Task:updateQueues - Queues updated",
			);
		} catch (e) {
			logger.error(
				{ err: e },
				"Task:updateQueues - Error while updating queues",
			);
		}
	}

	async updateSummonerIcons(): Promise<void> {
		const summonerIcons = await rh.getSummonerIcons();
		if (summonerIcons.length <= 0) {
			logger.warn(
				"Task:updateSummonerIcons - No summoner icons found in CDN response",
			);
			return;
		}

		try {
			await db.delete(LEAGUE_SUMMONER_ICONS_TABLE);
			await db.insert(LEAGUE_SUMMONER_ICONS_TABLE).values(summonerIcons);
			logger.debug(
				{ amount: summonerIcons.length },
				"Task:updateSummonerIcons - Summoner icons updated",
			);
		} catch (e) {
			logger.error(
				{ err: e },
				"Task:updateSummonerIcons - Error while updating summoner icons",
			);
		}
	}

	async updateSummonerSpells(): Promise<void> {
		const summonerSpells = await rh.getSummonerSpells();
		if (summonerSpells.length <= 0) {
			logger.warn(
				"Task:updateSummonerSpells - No summoner spells found in CDN response",
			);
			return;
		}
		try {
			// remove all summoner spells from array if id 4294967295
			const filtered = summonerSpells.filter((spell) => {
				return spell.id !== 4294967295;
			});
			await db.delete(LEAGUE_SUMMONER_SPELLS_TABLE);
			await db.insert(LEAGUE_SUMMONER_SPELLS_TABLE).values(filtered);
			logger.debug(
				{ amount: summonerSpells.length },
				"Task:updateSummonerSpells - Summoner spells updated",
			);
		} catch (e) {
			logger.error(
				{ err: e },
				"Task:updateSummonerSpells - Error while updating summoner spells",
			);
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

		logger.info("Task:updateEverything - All game data updated");
	}
}

export default new GameDataTask();
