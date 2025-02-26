import { GameDataTask } from "./GameDataTask.js";
import { MatchTask } from "./MatchTask.js";
import { SummonerTask } from "./SummonerTask.js";

const matchTask = new MatchTask();
const summonerTask = new SummonerTask();
const gameDataTask = new GameDataTask();

/**
 * Runs recurring updates at specified intervals
 * @param initialIteration Initial iteration
 * @param intervalTime Time between iterations in milliseconds
 */
async function intervalUpdate(
	initialIteration: number,
	intervalTime: number,
): Promise<void> {
	let iteration = initialIteration;
	if (iteration % 25 === 0) {
		await summonerTask.updateSummonerData();
		await gameDataTask.updateEverything();
	}

	await matchTask.updateMatchData(69, 0);

	// Sleep for the specified interval
	await new Promise((resolve) => setTimeout(resolve, intervalTime));

	// Next iteration
	iteration += 1;
	await intervalUpdate(iteration, intervalTime);
}

// Start at iteration 0 and run every hour
intervalUpdate(0, 60 * 60 * 1000).catch(console.error);
