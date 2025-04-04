import fs from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import express from "express";
import logger from "../../helpers/Logger.js";
import { intervalUpdate } from "../../tasks/MainTask.js";
import { router } from "../trcp.js";
import { generalRouter } from "./general.js";
import { lolRouter } from "./lol.js";
import { penAndPaperRouter } from "./penAndPaper.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const staticFilesPath = join(__dirname, "..", "..", "..", "..", "..", "static");
const spaFilesPath = join(
	__dirname,
	"..",
	"..",
	"..",
	"..",
	"..",
	"packages",
	"client",
	"dist",
);

// Validate paths exist
if (!fs.existsSync(staticFilesPath)) {
	throw new Error(`The folder at ${staticFilesPath} does not exist.`);
}

if (!fs.existsSync(spaFilesPath)) {
	throw new Error(`The client/dist folder at ${spaFilesPath} does not exist.`);
}

const appRouter = router({
	lol: lolRouter,
	general: generalRouter,
	penAndPaper: penAndPaperRouter,
});

const app = express();
app.use(cors());
app.use("/static", express.static(staticFilesPath));
app.use(
	"/trpc",
	trpcExpress.createExpressMiddleware({
		router: appRouter,
	}),
);
// Serve SPA files
app.use(express.static(spaFilesPath));

// Fallback route for SPA client-side routing
app.get("*", (req, res, next) => {
	// Exclude API routes
	if (req.path.startsWith("/trpc") || req.path.startsWith("/static")) {
		return next();
	}

	// Serve the SPA's index.html for all other routes
	res.sendFile(join(spaFilesPath, "index.html"), (err) => {
		if (err) {
			next(err);
		}
	});
});

const PORT = process.env.PROD_PORT ? Number(process.env.PROD_PORT) : 3000;
app.listen(PORT);
logger.info(
	{
		port: PORT,
		baseUrl: "http://localhost",
		url: `http://localhost:${PORT}/trpc`,
	},
	"API:Startup - tRPC Server is running",
);

export type AppRouter = typeof appRouter;

const RUN_TASKS = process.env.RUN_TASKS?.toLowerCase() === "true";
if (RUN_TASKS) {
	const UPDATE_INTERVAL = process.env.UPDATE_INTERVAL
		? Number(process.env.UPDATE_INTERVAL)
		: 3600000;
	intervalUpdate(0, UPDATE_INTERVAL).catch(logger.error);
}
