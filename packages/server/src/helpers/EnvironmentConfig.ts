import "dotenv/config";
import { z } from "zod/v4";

/**
 * The backend server port.
 * Defaults to 3000 if not set or not a valid number.
 */
export const BACKEND_PORT = z.coerce
	.number()
	.default(3000)
	.parse(process.env.PROD_PORT);

/**
 * The primary database URL.
 */
export const DB_URL = z.url().parse(process.env.DB_URL);

/**
 * Flag indicating whether periodic background tasks should run.
 * Defaults to false if not set or not "true".
 */
export const RUN_TASKS = z
	.stringbool()
	.default(false)
	.parse(process.env.RUN_TASKS?.toLowerCase());

/**
 * Initial delay in milliseconds before starting background tasks.
 * Defaults to 300000 (5 minutes) if not set or not a valid number.
 */
export const BACKGROUND_TASK_INITIAL_DELAY = z.coerce
	.number()
	.default(300000)
	.parse(process.env.BACKGROUND_TASK_INITIAL_DELAY);

/**
 * Interval in milliseconds for updating starting tasks.
 * Defaults to 3600000 (1 hour) if not set or not a valid number.
 */
export const UPDATE_INTERVAL = z.coerce
	.number()
	.default(3600000)
	.parse(process.env.UPDATE_INTERVAL);

/**
 * The API key for the Riot Games API.
 */
export const RIOT_API_KEY = z.string().parse(process.env.RIOT_API_KEY);

/**
 * The path to the built client files.
 */
export const CLIENT_DIST_PATH = z
	.string()
	.default("/client/dist")
	.parse(process.env.CLIENT_DIST_PATH);

export const ADMIN_PASSWORD_HASH = z
	.string()
	.parse(process.env.ADMIN_PASSWORD_HASH);

export const ADMIN_PASSWORD_SALT = z
	.string()
	.parse(process.env.ADMIN_PASSWORD_SALT);
export const ADMIN_PASSWORD_ITERATIONS = z.coerce
	.number()
	.default(600_000)
	.parse(process.env.ADMIN_PASSWORD_ITERATIONS);
