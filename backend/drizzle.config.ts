/// <reference types="node" />
import "./src/lib/load-env.ts";

import { defineConfig } from "drizzle-kit";

export default defineConfig({
	out: "./src/db/migrations",
	schema: "./src/db/schema/index.ts",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
});