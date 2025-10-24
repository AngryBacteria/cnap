import fs from "node:fs";
import { join } from "node:path";
import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import express from "express";
import {
	BACKEND_PORT,
	BACKGROUND_TASK_INITIAL_DELAY,
	CLIENT_DIST_PATH,
	RUN_TASKS,
	UPDATE_INTERVAL,
} from "../../helpers/EnvironmentConfig.js";
import logger from "../../helpers/Logger.js";
import { intervalUpdate } from "../../tasks/MainTask.js";
import { router } from "../trcp.js";
import { generalRouter } from "./general.js";
import { lolRouter } from "./lol.js";
import { penAndPaperRouter } from "./penAndPaper.js";

// Validate spa path exist
if (!fs.existsSync(CLIENT_DIST_PATH)) {
	logger.error(
		`The client/dist folder at ${CLIENT_DIST_PATH} does not exist. Frontend will not work`,
	);
} else {
	logger.info(`Serving SPA from path: ${CLIENT_DIST_PATH}`);
}

const appRouter = router({
	lol: lolRouter,
	general: generalRouter,
	penAndPaper: penAndPaperRouter,
});

const app = express();
app.use(cors());
app.use(
	"/trpc",
	trpcExpress.createExpressMiddleware({
		router: appRouter,
	}),
);
// Serve SPA files
app.use(express.static(CLIENT_DIST_PATH));

// Fallback route for SPA client-side routing
app.get("*", (req, res, next) => {
	// Exclude API routes
	if (req.path.startsWith("/trpc") || req.path.startsWith("/static")) {
		return next();
	}

	// Serve the SPA's index.html for all other routes
	res.sendFile(join(CLIENT_DIST_PATH, "index.html"), (err) => {
		if (err) {
			next(err);
		}
	});
});

app.listen(BACKEND_PORT);
logger.info(
	{
		port: BACKEND_PORT,
		baseUrl: "http://localhost",
		url: `http://localhost:${BACKEND_PORT}/trpc`,
	},
	"API:Startup - tRPC Server is running",
);

export type AppRouter = typeof appRouter;

if (RUN_TASKS) {
	logger.info(`Starting task in ${BACKGROUND_TASK_INITIAL_DELAY} ms...`);
	setTimeout(() => {
		intervalUpdate(0, UPDATE_INTERVAL).catch(logger.error);
	}, BACKGROUND_TASK_INITIAL_DELAY);
}
