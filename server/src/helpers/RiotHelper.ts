import { RateLimiter } from "limiter";
import "dotenv/config";
import { type Account, AccountSchema } from "src/model/Account.js";
import { type Champion, ChampionSchema } from "src/model/Champion.js";
import { ChampionSummarySchema } from "src/model/ChampionSummary.js";
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
	const mappedPath =
		`https://raw.communitydragon.org/latest/plugins/${plugin}/global/default/${assetPath}`.toLowerCase();

	return mappedPath;
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
			throw new Error(`HTTP error! Status: ${response.status}`);
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
			console.log("Successfully tested Riot-API connection");
			return true;
		} catch (e) {
			console.log(
				`Error while testing Riot-API connection. Check your API-Key: ${e}`,
			);
			return false;
		}
	}

	/**
	 * Fetch a match from the Riot-API. No schema validation as data changes quite often.
	 * @param matchId The match id of the match to fetch
	 * @returns Dict representation of the match
	 */
	async getMatch(matchId: string): Promise<Record<string, unknown> | null> {
		try {
			const url = `https://europe.api.riotgames.com/lol/match/v5/matches/${matchId}`;
			const match = await this.makeRequest<Record<string, unknown>>(url);
			console.log(`Match [${matchId}] fetched with Riot-API`);
			return match;
		} catch (e) {
			console.error(
				`Error while fetching Match [${matchId}] with Riot-API: ${e}`,
			);
			return null;
		}
	}

	/**
	 * Fetch a timeline from the Riot-API. No schema validation as data changes quite often.
	 * @param timelineId The id of the timeline to fetch
	 * @returns Dict representation of the timeline
	 */
	async getTimeline(
		timelineId: string,
	): Promise<Record<string, unknown> | null> {
		try {
			const url = `https://europe.api.riotgames.com/lol/match/v5/matches/${timelineId}/timeline`;
			const timeline = await this.makeRequest<Record<string, unknown>>(url);
			console.log(`Timeline [${timelineId}] fetched with Riot-API`);
			return timeline;
		} catch (e) {
			console.error(
				`Error while fetching Timeline [${timelineId}] with Riot-API: ${e}`,
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
			console.log(
				`Fetched Matchlist [count=${count}, offset=${offset}] [${puuid}] with Riot-API`,
			);
			return matchList;
		} catch (e) {
			console.error(
				`Error while fetching Matchlist [count=${count}, offset=${offset}] of Summoner [${puuid}] with Riot-API: ${e}`,
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
			console.log(
				`Fetched Account [${name} - ${tag}] by name-tag with Riot-API`,
			);
			return account;
		} catch (e) {
			console.error(
				`Error while fetching Account [${name} - ${tag}] with Riot-API: ${e}`,
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
			console.log(`Fetched Account [${puuid}] by puuid with Riot-API`);
			return account;
		} catch (e) {
			console.error(
				`Error while fetching Account [${puuid}] with Riot-API: ${e}`,
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
			console.log(`Fetched Summoner [${puuid}] by puuid with Riot-API`);

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
			console.error("Account not found");
			return null;
		} catch (e) {
			console.error(
				`Error while fetching Summoner [${puuid}] with Riot-API: ${e}`,
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
			console.error("Account not found");
			return null;
		} catch (e) {
			console.error(
				`Error while fetching Summoner [${name} - ${tag}] with Riot-API: ${e}`,
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

			console.log(`Fetched ${output.length} Items with Riot-CDN`);
			return output;
		} catch (e) {
			console.error(`Error while fetching Items with Riot-CDN: ${e}`);
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

			console.log(`Fetched ${outputData.length} Champions with Riot-CDN`);
			return outputData;
		} catch (e) {
			console.error(`Error while fetching Champions with Riot-CDN: ${e}`);
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

			console.log(`Fetched ${gameModes.length} Game Modes with Riot-CDN`);
			return gameModes;
		} catch (e) {
			console.error(`Error while fetching Game Modes with Riot-CDN: ${e}`);
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

			console.log(`Fetched ${gameTypes.length} Game Types with Riot-CDN`);
			return gameTypes;
		} catch (e) {
			console.error(`Error while fetching Game Types with Riot-CDN: ${e}`);
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

			console.log(`Fetched ${maps.length} Maps with Riot-CDN`);
			return maps;
		} catch (e) {
			console.error(`Error while fetching Maps with Riot-CDN: ${e}`);
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

			console.log(`Fetched ${queues.length} Queues with Riot-CDN`);
			return queues;
		} catch (e) {
			console.error(`Error while fetching Queues with Riot-CDN: ${e}`);
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

			console.log(`Fetched ${icons.length} Summoner Icons with Riot-CDN`);
			return icons;
		} catch (e) {
			console.error(`Error while fetching Summoner Icons with Riot-CDN: ${e}`);
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

			console.log(`Fetched ${spells.length} Summoner Spells with Riot-CDN`);
			return spells;
		} catch (e) {
			console.error(`Error while fetching Summoner Spells with Riot-CDN: ${e}`);
			return [];
		}
	}
}
