import { sql } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "#db/index.ts";

export const healthRoute = new Hono();

// A "real" health check, not just "the process is running" —
// it confirms the app can actually reach Postgres. This matters a lot
// once this is deployed behind Caddy in Phase 8/9: a dead DB connection
// should show up here before it shows up as a mystery 500 elsewhere.
healthRoute.get("/", async (c) => {
	try {
		await db.execute(sql`select 1`);
		return c.json({
			status: "ok",
			database: "connected",
			uptime: process.uptime(),
			timestamp: new Date().toISOString(),
		});
	} catch (err) {
		console.error("[health] database unreachable", err);
		return c.json(
			{
				status: "degraded",
				database: "unreachable",
				timestamp: new Date().toISOString(),
			},
			503,
		);
	}
});
