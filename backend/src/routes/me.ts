// Path: src/routes/me.ts
import { Hono } from "hono";
import { requireAuth } from "#middleware/index.js";
import type { AppVariables } from "#types.js";

export const meRoute = new Hono<{ Variables: AppVariables }>();

meRoute.use("*", requireAuth);

// GET /api/me — thin wrapper so the frontend doesn't need to know
// about Better Auth's own session shape/endpoint to get "who am I".
meRoute.get("/", (c) => {
	const user = c.get("user")!;
	return c.json({ data: user });
});
