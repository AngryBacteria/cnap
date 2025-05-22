import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { GameDataTask } from "../tasks/GameDataTask.js";

export const db = drizzle({
	connection: {
		connectionString: process.env.DATABASE_URL,
		ssl: false, // TODO
	},
	casing: "snake_case",
});

const task = new GameDataTask();
await task.updateEverything();
