import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import logger from "../helpers/Logger.js";
import riotHelper from "../helpers/RiotHelper.js";
import { LEAGUE_MATCH_PARTICIPANTS_TABLE } from "./schemas/MatchV5.js";

export const db = drizzle({
	connection: {
		connectionString: process.env.DATABASE_URL,
		ssl: false, // TODO
	},
	casing: "snake_case",
});

async function insertMatch() {
	const match = await riotHelper.getMatch("EUW1_7084514418");

	if (match) {
		const participants: (typeof LEAGUE_MATCH_PARTICIPANTS_TABLE.$inferInsert)[] =
			match.info.participants.map((p) => {
				return {
					matchId: match.metadata.matchId,
					queueId: match.info.queueId,
					mapId: match.info.mapId,
					gameMode: match.info.gameMode,
					gameDuration: match.info.gameDuration,
					...p,
				};
			});
		await db.insert(LEAGUE_MATCH_PARTICIPANTS_TABLE).values(participants);
	}
	logger.debug("done");
}
