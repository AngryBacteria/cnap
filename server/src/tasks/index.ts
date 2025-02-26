import  gameDataTask  from "./GameDataTask.js";
import  matchTask  from "./MatchTask.js";
import  summonerTask  from "./SummonerTask.js";

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

	console.log(`Starting interval update iteration: ${iteration}`);
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
