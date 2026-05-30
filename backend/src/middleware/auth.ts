// Path: src/middleware/auth.ts
import type { MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { auth } from "#lib/auth.js";
import type { AppVariables } from "#types.js";

// Runs on every request. Cheap when there's no session cookie — just
// makes `c.get("user")` available downstream without every route
// having to re-check the session itself.
export const attachSession: MiddlewareHandler<{
	Variables: AppVariables;
}> = async (c, next) => {
	const result = await auth.api.getSession({ headers: c.req.raw.headers });
	c.set("user", result?.user ?? null);
	c.set("session", result?.session ?? null);
	await next();
};

export const requireAuth: MiddlewareHandler<{
	Variables: AppVariables;
}> = async (c, next) => {
	const user = c.get("user");
	if (!user) {
		throw new HTTPException(401, { message: "Authentication required" });
	}
	await next();
};

export const requireAdmin: MiddlewareHandler<{
	Variables: AppVariables;
}> = async (c, next) => {
	const user = c.get("user");
	if (!user) {
		throw new HTTPException(401, { message: "Authentication required" });
	}
	if (user.role !== "admin") {
		throw new HTTPException(403, { message: "Admin access required" });
	}
	await next();
};
