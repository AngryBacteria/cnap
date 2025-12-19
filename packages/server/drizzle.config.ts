import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import {DB_URL} from "./src/helpers/EnvironmentConfig";

export default defineConfig({
    out: './drizzle',
    schema: './src/db/schemas',
    dialect: 'postgresql',
    schemaFilter: ["public", "league", "pnp", "core"],
    dbCredentials: {
        url: DB_URL,
    },
});