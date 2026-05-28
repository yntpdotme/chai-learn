// Path: apps/backend/src/middleware/error-handler.ts
import type { ErrorHandler, NotFoundHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { ZodError } from "zod";
import { isProd } from "#env.js";

export const errorHandler: ErrorHandler = (err, c) => {
	// Errors we threw on purpose (404, 400, etc.) — trust the status/message.
	if (err instanceof HTTPException) {
		return c.json({ error: err.message }, err.status);
	}

	// zValidator throws ZodError on invalid request bodies.
	if (err instanceof ZodError) {
		return c.json({ error: "Validation failed", details: err.flatten() }, 400);
	}

	// Anything else is unexpected — log full detail server-side,
	// but never leak internals (stack traces, DB errors) to the client.
	console.error(
		JSON.stringify({
			level: "error",
			message: err.message,
			stack: isProd ? undefined : err.stack,
			timestamp: new Date().toISOString(),
		}),
	);

	return c.json({ error: "Internal server error" }, 500);
};

export const notFoundHandler: NotFoundHandler = (c) => {
	return c.json(
		{ error: `Route not found: ${c.req.method} ${c.req.path}` },
		404,
	);
};
