import logger from "../../helpers/Logger.js";
import { publicProcedure } from "../trcp.js";

export const loggedProcedure = publicProcedure.use(async (opts) => {
	const startTime = performance.now();
	const result = await opts.next();
	const processingTime = performance.now() - startTime;
	logger.trace(
		{ processingTime: processingTime.toFixed(2) },
		`Middleware: Processing time ${processingTime.toFixed(2)}ms`,
	);
	return result;
});
