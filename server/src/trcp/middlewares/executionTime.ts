import logger from "../../helpers/Logger.js";
import { publicProcedure } from "../trcp.js";

export const loggedProcedure = publicProcedure.use(async (opts) => {
	const startTime = performance.now();

	// 5 second delay
	await new Promise((resolve) => setTimeout(resolve, 2000));

	const result = await opts.next();
	const processingTime = performance.now() - startTime;
	logger.trace(
		{ processingTimeMS: processingTime.toFixed(2), path: opts.path },
		"Middleware:loggedProcedure",
	);
	return result;
});
