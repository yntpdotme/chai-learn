// Path: apps/backend/src/lib/params.ts
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

const uuidSchema = z.uuid();

/**
 * Validates a route param is a well-formed UUID before it hits the DB.
 * Without this, a malformed id (e.g. "123") reaches Postgres and throws
 * a raw driver error that gets reported as a 500 instead of a clean 400.
 */
export function parseUuidParam(value: string, name = "id"): string {
	const result = uuidSchema.safeParse(value);
	if (!result.success) {
		throw new HTTPException(400, {
			message: `Invalid ${name}: must be a UUID`,
		});
	}
	return result.data;
}
