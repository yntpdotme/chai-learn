// Path: /src/routes/lessons.ts
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

import { db } from "#db/index.js";
import { lessons } from "#db/schema/index.js";
import { parseUuidParam } from "#lib/params.js";

export const lessonsRoute = new Hono();

// GET /api/lessons/:id
lessonsRoute.get("/:id", async (c) => {
	const id = parseUuidParam(c.req.param("id"));

	const [lesson] = await db.select().from(lessons).where(eq(lessons.id, id));

	if (!lesson) {
		throw new HTTPException(404, { message: `Lesson ${id} not found` });
	}

	return c.json({ data: lesson });
});
