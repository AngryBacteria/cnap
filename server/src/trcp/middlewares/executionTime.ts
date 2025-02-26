import {publicProcedure} from "../trcp.js";

export const loggedProcedure = publicProcedure.use(async (opts) => {
    const startTime = performance.now();
    const result = await opts.next();
    const processingTime = performance.now() - startTime;
    console.debug(`[${opts.path}] Processing time: ${processingTime.toFixed(2)}ms`);
    return result;
});