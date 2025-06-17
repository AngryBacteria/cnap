import logger from "../helpers/Logger.js";
import gameDataTask from "./GameDataTask.js";
import matchTask from "./MatchTask.js";
import summonerTask from "./SummonerTask.js";

/**
 * Runs recurring updates at specified intervals
 * @param initialIteration Initial iteration
 * @param intervalTime Time between iterations in milliseconds
 */
export async function intervalUpdate(
	initialIteration: number,
	intervalTime: number,
): Promise<void> {
	let iteration = initialIteration;

	logger.debug(
		{ iteration, initialIteration, intervalTime },
		"Task:intervalUpdate - Starting interval update ",
	);
	if (iteration % 25 === 0) {
		await summonerTask.updateSummonerData();
		await gameDataTask.updateEverything();
	}

	await matchTask.updateSummonerMatchData(95, 0);

	// Sleep for the specified interval
	await new Promise((resolve) => setTimeout(resolve, intervalTime));

	// Next iteration
	iteration += 1;
	await intervalUpdate(iteration, intervalTime);
}
