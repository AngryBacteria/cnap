import fs from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loggedProcedure } from "./middlewares/executionTime.js";

// Static file paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const staticFilesPath = join(__dirname, "..", "..", "..", "static");
if (!fs.existsSync(staticFilesPath)) {
	throw new Error(`The folder at ${staticFilesPath} does not exist.`);
}

// TRPC server
import { initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import express from "express";
const t = initTRPC.create();
const appRouter = t.router({
	userList: loggedProcedure.query(() => {
		return [
			{ id: 1, name: "John Doe" },
			{ id: 2, name: "Jane Doe" },
		];
	}),
});

const app = express();
app.use("/static", express.static(staticFilesPath));
app.use(
	"/trpc",
	trpcExpress.createExpressMiddleware({
		router: appRouter,
	}),
);
app.listen(3000);
console.log("TRCP Server is running on http://localhost:3000/trpc");
