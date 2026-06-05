// Path: src/routes/progress.ts
import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { db } from "#db/index.js";
import { lessons, progress, upsertProgressSchema } from "#db/schema/index.js";
import { requireAuth } from "#middleware/auth.js";
import type { AppVariables } from "#types.js";

export const progressRoute = new Hono<{ Variables: AppVariables }>();

progressRoute.use("*", requireAuth);

// POST /api/progress
// Upserts progress for the logged-in user + a given lesson — relies on
// the unique constraint already defined in the progress schema.
// userId now comes from the session, not the request body, so one
// user can no longer write progress on another user's behalf.
progressRoute.post("/", zValidator("json", upsertProgressSchema), async (c) => {
	const user = c.get("user");
	if (!user) {
		return c.json({ error: "Unauthorized" }, 401);
	}
	const userId = user.id;
	const { lessonId, completed } = c.req.valid("json");

	const [lesson] = await db
		.select({ id: lessons.id })
		.from(lessons)
		.where(eq(lessons.id, lessonId));
	if (!lesson) {
		throw new HTTPException(404, { message: `Lesson ${lessonId} not found` });
	}

	const [existing] = await db
		.select()
		.from(progress)
		.where(and(eq(progress.userId, userId), eq(progress.lessonId, lessonId)));

	const now = new Date();

	if (existing) {
		const [updated] = await db
			.update(progress)
			.set({ completed, completedAt: completed ? now : null })
			.where(eq(progress.id, existing.id))
			.returning();

		return c.json({ data: updated }, 200);
	}

	const [created] = await db
		.insert(progress)
		.values({
			userId,
			lessonId,
			completed,
			completedAt: completed ? now : null,
		})
		.returning();

	return c.json({ data: created }, 201);
});
