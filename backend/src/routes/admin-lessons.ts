import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

import { db } from "#db/index.js";
import { lessons, updateLessonSchema } from "#db/schema/index.js";
import { parseUuidParam } from "#lib/params.js";
import { requireAdmin, requireAuth } from "#middleware/index.js";
import type { AppVariables } from "#types.js";

export const adminLessonsRoute = new Hono<{ Variables: AppVariables }>();

adminLessonsRoute.use("*", requireAuth, requireAdmin);

// PATCH /api/admin/lessons/:id
adminLessonsRoute.patch(
	"/:id",
	zValidator("json", updateLessonSchema),
	async (c) => {
		const id = parseUuidParam(c.req.param("id"));
		const input = c.req.valid("json");

		const [updated] = await db
			.update(lessons)
			.set(input)
			.where(eq(lessons.id, id))
			.returning();

		if (!updated) {
			throw new HTTPException(404, { message: `Lesson ${id} not found` });
		}

		return c.json({ data: updated });
	},
);

// DELETE /api/admin/lessons/:id — cascades to progress via FK constraint
adminLessonsRoute.delete("/:id", async (c) => {
	const id = parseUuidParam(c.req.param("id"));

	const [deleted] = await db
		.delete(lessons)
		.where(eq(lessons.id, id))
		.returning();

	if (!deleted) {
		throw new HTTPException(404, { message: `Lesson ${id} not found` });
	}

	return c.body(null, 204);
});