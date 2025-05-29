import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schemas/index.js";

export const db = drizzle({
	connection: {
		connectionString: process.env.DATABASE_URL,
		ssl: false, // TODO
	},
	casing: "snake_case",
	schema,
});
