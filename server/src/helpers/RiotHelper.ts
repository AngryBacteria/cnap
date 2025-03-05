import { RateLimiter } from "limiter";
import "dotenv/config";
import { type Account, AccountSchema } from "src/model/Account.js";
import {
	type Champion,
	ChampionSchema,
	ChampionSummarySchema,
} from "src/model/Champion.js";
import { type GameMode, GameModeSchema } from "src/model/GameMode.js";
import { type GameType, GameTypeSchema } from "src/model/GameType.js";
import { type Item, ItemSchema } from "src/model/Item.js";
import { type LeagueMap, LeagueMapSchema } from "src/model/Map.js";
import { type Queue, QueueSchema } from "src/model/Queue.js";
import { SummonerSchema } from "src/model/Summoner.js";
import type { SummonerDb } from "src/model/Summoner.js";
import { SummonerDbSchema } from "src/model/Summoner.js";
import {
	type SummonerIcon,
	SummonerIconSchema,
} from "src/model/SummonerIcon.js";
import {
	type SummonerSpell,
	SummonerSpellSchema,
} from "src/model/SummonerSpell.js";
import { z } from "zod";
import logger from "./Logger.js";

/**
 * Maps an asset path to the correct URL for the Community Dragon CDN.
 */
export function mapAssetPath(
	inputPath?: string,
	plugin = "rcp-be-lol-game-data",
): string {
	const prefix = "/lol-game-data/assets/";

	if (!inputPath) {
		return "";
	}

	if (!inputPath.startsWith(prefix)) {
		return inputPath;
	}

	const assetPath = inputPath.substring(prefix.length);
	return `https://raw.communitydragon.org/latest/plugins/${plugin}/global/default/${assetPath}`.toLowerCase();
}

export class RiotHelper {
	private readonly riotApiKey: string;
	private limiter1: RateLimiter;
	private limiter2: RateLimiter;

	constructor() {
		// Initialize Riot API Key
		const riotKey = process.env.RIOT_API_KEY;
		if (!riotKey) {
			throw new Error("No Riot API Key found in Environment");
		}

		this.riotApiKey = riotKey;

		// Initialize rate limiter (80 requests per 120 seconds)
		this.limiter1 = new RateLimiter({
			tokensPerInterval: 80,
			interval: 120 * 1000,
		});
		// Initialize rate limiter (10 requests per second)
		this.limiter2 = new RateLimiter({
			tokensPerInterval: 10,
			interval: 1000,
		});
	}

	/**
	 * Make a request to the Riot API.
	 * @param url The URL to request
	 * @param schema Optional Zod schema to validate the response
	 * @param useLimiter Whether to use the rate limiter
	 * @returns The response data
	 */
	private async makeRequest<T>(
		url: string,
		schema?: z.ZodType<T>,
		useLimiter = true,
	): Promise<T> {
		if (useLimiter) {
			await this.limiter1.removeTokens(1);
			await this.limiter2.removeTokens(1);
		}

		const response = await fetch(url, {
			headers: {
				"X-Riot-Token": this.riotApiKey,
			},
		});

		if (!response.ok) {
			throw new Error(
				`HTTP Status ${response.status} error: ${response.statusText}`,
			);
		}

		const jsonData = await response.json();

		if (jsonData === null) {
			throw new Error("No data returned");
		}

		if (schema) {
			return schema.parse(jsonData);
		}

		return jsonData as T;
	}

	/**
	 * Test Riot API connection by attempting to fetch the lol status endpoint.
	 * Returns true if connection is successful, false otherwise.
	 */
	async testConnection(): Promise<boolean> {
		try {
			await this.makeRequest(
				"https://euw1.api.riotgames.com/lol/status/v4/platform-data",
			);
			logger.debug({ connected: true }, "RiotHelper:testConnection");
			return true;
		} catch (e) {
			logger.error({ error: e, connected: false }, "RiotHelper:testConnection");
			return false;
		}
	}

	/**
	 * Fetch a match from the Riot-API. No schema validation as data changes quite often.
	 * @param matchId The match id of the match to fetch
	 * @returns Dict representation of the match
	 */
	async getMatch(matchId: string): Promise<unknown | null> {
		try {
			const url = `https://europe.api.riotgames.com/lol/match/v5/matches/${matchId}`;
			const match = await this.makeRequest(url);
			logger.debug({ matchId }, "RiotHelper:getMatch");
			return match;
		} catch (e) {
			logger.error({ matchId, error: e }, "RiotHelper:getMatch");
			return null;
		}
	}

	/**
	 * Fetch a timeline from the Riot-API. No schema validation as data changes quite often.
	 * @param timelineId The id of the timeline to fetch
	 * @returns Dict representation of the timeline
	 */
	async getTimeline(timelineId: string): Promise<unknown | null> {
		try {
			const url = `https://europe.api.riotgames.com/lol/match/v5/matches/${timelineId}/timeline`;
			const timeline = await this.makeRequest(url);
			logger.debug({ timelineId }, "RiotHelper:getTimeline");
			return timeline;
		} catch (e) {
			logger.error({ timelineId, error: e }, "RiotHelper:getTimeline");
			return null;
		}
	}

	/**
	 * Fetch a matchlist from the Riot-API for a given puuid (summoner).
	 * @param puuid The puuid of the summoner to fetch the matchlist for
	 * @param count How many matches to parse (max 100)
	 * @param offset The offset to start fetching matches
	 * @returns A list of match_ids (strings) for the given summoner
	 */
	async getMatchList(puuid: string, count = 95, offset = 0): Promise<string[]> {
		try {
			const url = `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${offset}&count=${count}`;
			const matchList = await this.makeRequest(url, z.array(z.string()));
			logger.debug({ puuid }, "RiotHelper:getMatchList");
			return matchList;
		} catch (e) {
			logger.error({ puuid, error: e }, "RiotHelper:getMatchList");
			return [];
		}
	}

	/**
	 * Fetch an account from the Riot-API by name and tag.
	 * @param name Name of the account
	 * @param tag Tag of the account (4 characters)
	 * @returns AccountDTO object
	 */
	async getRiotAccountByTag(
		name: string,
		tag: string,
	): Promise<Account | null> {
		try {
			const properTag = tag.replace("#", "");
			const url = `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${name}/${properTag}`;
			const account = await this.makeRequest(url, AccountSchema);
			logger.debug({ name, tag }, "RiotHelper:getRiotAccountByTag");
			return account;
		} catch (e) {
			logger.error({ name, tag, error: e }, "RiotHelper:getRiotAccountByTag");
			return null;
		}
	}

	/**
	 * Fetch an account from the Riot-API by puuid.
	 * @param puuid The puuid of the account
	 * @returns AccountDTO object
	 */
	async getRiotAccountByPuuid(puuid: string): Promise<Account | null> {
		try {
			const url = `https://europe.api.riotgames.com/riot/account/v1/accounts/by-puuid/${puuid}`;
			const account = await this.makeRequest(url, AccountSchema);
			logger.debug({ puuid }, "RiotHelper:getRiotAccountByPuuid");
			return account;
		} catch (e) {
			logger.error({ puuid, error: e }, "RiotHelper:getRiotAccountByPuuid");
			return null;
		}
	}

	/**
	 * Fetch a summoner from the Riot-API by puuid. Additionally, the account is also fetched to get the gameName and
	 * tagLine. The summoner and account data is then merged into a SummonerDBDTO object.
	 * @param puuid The puuid of the summoner to fetch
	 * @param account Optionally provide the account directly doesn't need to be fetched again
	 * @returns SummonerDBDTO object with the merged data
	 */
	async getSummonerByPuuidRiot(
		puuid: string,
		account?: Account | null,
	): Promise<SummonerDb | null> {
		try {
			const url = `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`;
			const summonerRiot = await this.makeRequest(url, SummonerSchema);
			logger.debug({ puuid }, "RiotHelper:getSummonerByPuuidRiot");

			// check if account provided
			let properAccount: Account | null | undefined = account;
			if (!account) {
				properAccount = await this.getRiotAccountByPuuid(summonerRiot.puuid);
			}

			if (properAccount) {
				// Merge the two objects
				const mergedData = { ...summonerRiot, ...properAccount };
				return SummonerDbSchema.parse(mergedData);
			}
			logger.error(
				{ puuid },
				"RiotHelper:getSummonerByPuuidRiot - not able to merge data",
			);
			return null;
		} catch (e) {
			logger.error({ puuid, error: e }, "RiotHelper:getSummonerByPuuidRiot");
			return null;
		}
	}

	/**
	 * Fetch a summoner from the Riot-API by name and tag. The account is fetched first and then the summoner is
	 * fetched by the puuid.
	 * @param name Name of the account
	 * @param tag Tag of the account (4 characters)
	 * @returns SummonerDBDTO object
	 */
	async getSummonerByAccountTag(
		name: string,
		tag: string,
	): Promise<SummonerDb | null> {
		try {
			const account = await this.getRiotAccountByTag(name, tag);
			if (account) {
				return this.getSummonerByPuuidRiot(account.puuid, account);
			}
			logger.error({ name, tag }, "RiotHelper:getSummonerByAccountTag");
			return null;
		} catch (e) {
			logger.error(
				{ name, tag, error: e },
				"RiotHelper:getSummonerByAccountTag",
			);
			return null;
		}
	}

	/**
	 * Fetch items from Community Dragon CDN
	 * @returns Array of ItemDTO objects
	 */
	async getItems(): Promise<Item[]> {
		try {
			const output = await this.makeRequest(
				"https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/items.json",
				ItemSchema.array(),
				false,
			);
			for (const item of output) {
				item.iconPath = mapAssetPath(item.iconPath);
			}

			logger.debug({ amount: output.length }, "RiotHelper:getItems");
			return output;
		} catch (e) {
			logger.error({ error: e }, "RiotHelper:getItems");
			return [];
		}
	}

	/**
	 * Fetch champions from Community Dragon CDN
	 * @returns Array of ChampionDTO objects
	 */
	async getChampions(): Promise<Champion[]> {
		try {
			const outputData: Champion[] = [];
			const championsSummary = await this.makeRequest(
				"https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-summary.json",
				ChampionSummarySchema.array(),
				false,
			);

			for (const championSummary of championsSummary) {
				const champion = await this.makeRequest(
					`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champions/${championSummary.id}.json`,
					ChampionSchema,
					false,
				);

				if (champion.skins.length > 0) {
					champion.uncenteredSplashPath =
						champion.skins[0].uncenteredSplashPath;
				} else {
					champion.uncenteredSplashPath = "";
				}

				champion.squarePortraitPath = mapAssetPath(champion.squarePortraitPath);
				champion.stingerSfxPath = mapAssetPath(champion.stingerSfxPath);
				champion.chooseVoPath = mapAssetPath(champion.chooseVoPath);
				champion.banVoPath = mapAssetPath(champion.banVoPath);
				champion.uncenteredSplashPath = mapAssetPath(
					champion.uncenteredSplashPath,
				);

				for (const skin of champion.skins) {
					skin.splashPath = mapAssetPath(skin.splashPath);
					skin.uncenteredSplashPath = mapAssetPath(skin.uncenteredSplashPath);
					skin.tilePath = mapAssetPath(skin.tilePath);
					skin.loadScreenPath = mapAssetPath(skin.loadScreenPath);
				}

				champion.passive.abilityIconPath = mapAssetPath(
					champion.passive.abilityIconPath,
				);
				champion.passive.abilityVideoPath = mapAssetPath(
					champion.passive.abilityVideoPath,
				);
				champion.passive.abilityVideoImagePath = mapAssetPath(
					champion.passive.abilityVideoImagePath,
				);

				for (const spell of champion.spells) {
					spell.abilityIconPath = mapAssetPath(spell.abilityIconPath);
					spell.abilityVideoPath = mapAssetPath(spell.abilityVideoPath);
					spell.abilityVideoImagePath = mapAssetPath(
						spell.abilityVideoImagePath,
					);
				}

				outputData.push(champion);
			}

			logger.debug({ amount: outputData.length }, "RiotHelper:getChampions");
			return outputData;
		} catch (e) {
			logger.error({ error: e }, "RiotHelper:getChampions");
			return [];
		}
	}

	/**
	 * Fetch game modes from Riot API
	 * @returns Array of GameModeDTO objects
	 */
	async getGameModes(): Promise<GameMode[]> {
		try {
			const gameModes = await this.makeRequest(
				"https://static.developer.riotgames.com/docs/lol/gameModes.json",
				GameModeSchema.array(),
			);

			logger.debug({ amount: gameModes.length }, "RiotHelper:getGameModes");
			return gameModes;
		} catch (e) {
			logger.error({ error: e }, "RiotHelper:getGameModes");
			return [];
		}
	}

	/**
	 * Fetch game types from Riot API
	 * @returns Array of GameTypeDTO objects
	 */
	async getGameTypes(): Promise<GameType[]> {
		try {
			const gameTypes = await this.makeRequest(
				"https://static.developer.riotgames.com/docs/lol/gameTypes.json",
				GameTypeSchema.array(),
			);

			logger.debug({ amount: gameTypes.length }, "RiotHelper:getGameTypes");
			return gameTypes;
		} catch (e) {
			logger.error({ error: e }, "RiotHelper:getGameTypes");
			return [];
		}
	}

	/**
	 * Fetch maps from Riot API
	 * @returns Array of MapDTO objects
	 */
	async getMaps(): Promise<LeagueMap[]> {
		try {
			const maps = await this.makeRequest(
				"https://static.developer.riotgames.com/docs/lol/maps.json",
				LeagueMapSchema.array(),
			);

			logger.debug({ amount: maps.length }, "RiotHelper:getMaps");
			return maps;
		} catch (e) {
			logger.error({ error: e }, "RiotHelper:getMaps");
			return [];
		}
	}

	/**
	 * Fetch queues from Riot API
	 * @returns Array of QueueDTO objects
	 */
	async getQueues(): Promise<Queue[]> {
		try {
			const queues = await this.makeRequest(
				"https://static.developer.riotgames.com/docs/lol/queues.json",
				QueueSchema.array(),
			);

			logger.debug({ amount: queues.length }, "RiotHelper:getQueues");
			return queues;
		} catch (e) {
			logger.error({ error: e }, "RiotHelper:getQueues");
			return [];
		}
	}

	/**
	 * Fetch summoner icons from Community Dragon CDN
	 * @returns Array of SummonerIconDTO objects
	 */
	async getSummonerIcons(): Promise<SummonerIcon[]> {
		try {
			const icons = await this.makeRequest(
				"https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/summoner-icons.json",
				SummonerIconSchema.array(),
				false,
			);

			for (const icon of icons) {
				if (icon.imagePath) {
					icon.imagePath = mapAssetPath(icon.imagePath);
				}
			}

			logger.debug({ amount: icons.length }, "RiotHelper:getSummonerIcons");
			return icons;
		} catch (e) {
			logger.error({ error: e }, "RiotHelper:getSummonerIcons");
			return [];
		}
	}

	/**
	 * Fetch summoner spells from Community Dragon CDN
	 * @returns Array of SummonerSpellDTO objects
	 */
	async getSummonerSpells(): Promise<SummonerSpell[]> {
		try {
			const spells = await this.makeRequest(
				"https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/summoner-spells.json",
				SummonerSpellSchema.array(),
				false,
			);

			for (const spell of spells) {
				spell.iconPath = mapAssetPath(spell.iconPath);
			}

			logger.debug({ amount: spells.length }, "RiotHelper:getSummonerSpells");
			return spells;
		} catch (e) {
			logger.error({ error: e }, "RiotHelper:getSummonerSpells");
			return [];
		}
	}
}

export default new RiotHelper();
