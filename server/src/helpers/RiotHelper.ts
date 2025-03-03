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
import { type SummonerDb, SummonerDbSchema } from "src/model/SummonerDb.js";
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
			logger.debug("RiotHelper:testConnection - Connection successful");
			return true;
		} catch (e) {
			logger.error(
				`RiotHelper:testConnection - Error while testing Riot-API connection, check your API-Key: ${e}`,
			);
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
			logger.debug(
				`RiotHelper:getMatch - Match fetched by MatchId from Riot-API: ${matchId}`,
			);
			return match;
		} catch (e) {
			logger.error(
				`RiotHelper:getMatch - Error while fetching Match by MatchId from Riot-API: ${matchId} ${e}`,
			);
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
			logger.debug(
				`RiotHelper:getTimeline - Timeline fetched by TimelineId from Riot-API: ${timelineId}`,
			);
			return timeline;
		} catch (e) {
			logger.error(
				`RiotHelper:getTimeline - Error while fetching Timeline by TimelineId from Riot-API: ${timelineId} ${e}`,
			);
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
			logger.debug(
				`RiotHelper:getMatchList - Fetched Matchlist by puuid from Riot-API: ${puuid}`,
			);
			return matchList;
		} catch (e) {
			logger.error(
				`RiotHelper:getMatchList - Error while fetching Matchlist by puuid from Riot-API: ${puuid} ${e}`,
			);
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
			logger.debug(
				`RiotHelper:getRiotAccountByTag - Fetched Account with name-tag from Riot-API: ${name}-${tag}`,
			);
			return account;
		} catch (e) {
			logger.error(
				`RiotHelper:getRiotAccountByTag - Error while fetching Account by name-tag from Riot-API: ${name}-${tag} ${e}`,
			);
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
			logger.debug(
				`RiotHelper:getRiotAccountByPuuid - Fetched Account by puuid from Riot-API: ${puuid}`,
			);
			return account;
		} catch (e) {
			logger.error(
				`RiotHelper:getRiotAccountByPuuid - Error while fetching Account by puuid from Riot-API: ${puuid} ${e}`,
			);
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
			logger.debug(
				`RiotHelper:getSummonerByPuuidRiot - Fetched Summoner by puuid from Riot-API: ${puuid}`,
			);

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
				`RiotHelper:getSummonerByPuuidRiot - Account not found by puuid from Riot-API: ${puuid}`,
			);
			return null;
		} catch (e) {
			logger.error(
				`RiotHelper:getSummonerByPuuidRiot - Error while fetching Summoner by puuid from Riot-API: ${puuid} ${e}`,
			);
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
			logger.error(
				`RiotHelper:getSummonerByAccountTag - Summoner not found by name-tag from Riot-API: ${name}-${tag}`,
			);
			return null;
		} catch (e) {
			logger.error(
				`RiotHelper:getSummonerByAccountTag - Error while fetching Summoner by name-tag with Riot-API: ${name}-${tag} ${e}`,
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

			logger.debug(
				`RiotHelper:getItems - Fetched ${output.length} Items from Riot-CDN`,
			);
			return output;
		} catch (e) {
			logger.error(
				`RiotHelper:getItems - Error while fetching Items from Riot-CDN: ${e}`,
			);
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

			logger.debug(
				`RiotHelper:getChampions - Fetched ${outputData.length} Champions from Riot-CDN`,
			);
			return outputData;
		} catch (e) {
			logger.error(
				`RiotHelper:getChampions - Error while fetching Champions from Riot-CDN: ${e}`,
			);
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

			logger.debug(
				`RiotHelper:getGameModes - Fetched ${gameModes.length} Game Modes from Riot-CDN`,
			);
			return gameModes;
		} catch (e) {
			logger.error(
				`RiotHelper:getGameModes - Error while fetching Game Modes from Riot-CDN: ${e}`,
			);
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

			logger.debug(
				`RiotHelper:getGameTypes - Fetched ${gameTypes.length} Game Types from Riot-CDN`,
			);
			return gameTypes;
		} catch (e) {
			logger.error(
				`RiotHelper:getGameTypes - Error while fetching Game Types from Riot-CDN: ${e}`,
			);
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

			logger.debug(
				`RiotHelper:getMaps - Fetched ${maps.length} Maps from Riot-CDN`,
			);
			return maps;
		} catch (e) {
			logger.error(
				`RiotHelper:getMaps - Error while fetching Maps from Riot-CDN: ${e}`,
			);
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

			logger.debug(
				`RiotHelper:getQueues - Fetched ${queues.length} Queues from Riot-CDN`,
			);
			return queues;
		} catch (e) {
			logger.error(
				`RiotHelper:getQueues - Error while fetching Queues from Riot-CDN: ${e}`,
			);
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

			logger.debug(
				`RiotHelper:getSummonerIcons - Fetched ${icons.length} Summoner Icons from Riot-CDN`,
			);
			return icons;
		} catch (e) {
			logger.error(
				`RiotHelper:getSummonerIcons - Error while fetching Summoner Icons from Riot-CDN: ${e}`,
			);
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

			logger.debug(
				`RiotHelper:getSummonerSpells - Fetched ${spells.length} Summoner Spells from Riot-CDN`,
			);
			return spells;
		} catch (e) {
			logger.error(
				`RiotHelper:getSummonerSpells - Error while fetching Summoner Spells from Riot-CDN: ${e}`,
			);
			return [];
		}
	}
}

export default new RiotHelper();
