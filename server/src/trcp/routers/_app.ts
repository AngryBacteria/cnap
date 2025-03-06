import fs from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import express from "express";
import logger from "../../helpers/Logger.js";
import { router } from "../trcp.js";
import { lolRouter } from "./lol.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const staticFilesPath = join(__dirname, "..", "..", "..", "..", "static");
if (!fs.existsSync(staticFilesPath)) {
	throw new Error(`The folder at ${staticFilesPath} does not exist.`);
}

const appRouter = router({
	lol: lolRouter,
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
app.listen(3000);
logger.info(
	{
		port: 3000,
		baseUrl: "http://localhost",
		url: "http://localhost:3000/trpc",
	},
	"API:Startup - tRPC Server is running",
);

export type AppRouter = typeof appRouter;
