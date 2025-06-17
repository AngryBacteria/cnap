import "dotenv/config";
import { z } from "zod/v4";

/**
 * The backend server port.
 * Defaults to 3000 if not set or not a valid number.
 */
export const BACKEND_PORT = z
	.number()
	.default(3000)
	.parse(process.env.PROD_PORT);

/**
 * The primary database URL.
 */
export const DB_URL = z.url().parse(process.env.DB_URL);

/**
 * The connection string for MongoDB.
 */
export const MONGODB_CONNECTION_STRING = z
	.url()
	.parse(process.env.MONGODB_CONNECTION_STRING);

/**
 * Flag indicating whether periodic background tasks should run.
 * Defaults to false if not set or not "true".
 */
export const RUN_TASKS = z
	.stringbool()
	.default(false)
	.parse(process.env.RUN_TASKS?.toLowerCase());

/**
 * Interval in milliseconds for updating background tasks.
 * Defaults to 3600000 (1 hour) if not set or not a valid number.
 */
export const UPDATE_INTERVAL = z
	.number()
	.default(3600000)
	.parse(process.env.UPDATE_INTERVAL);

/**
 * The API key for the Riot Games API.
 */
export const RIOT_API_KEY = z.string().parse(process.env.RIOT_API_KEY);
