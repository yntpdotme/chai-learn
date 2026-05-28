// Path: apps/backend/src/routes/progress.ts
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

import { db } from "#db/index.js";
import {
	lessons,
	progress,
	upsertProgressSchema,
	users,
} from "#db/schema/index.js";

export const progressRoute = new Hono();

// POST /api/progress
// Upserts progress for a (user, lesson) pair — relies on the unique
// constraint already defined in the progress schema. No auth yet
// (that's Phase 4), so userId is trusted from the body for now.
progressRoute.post("/", zValidator("json", upsertProgressSchema), async (c) => {
	const { userId, lessonId, completed } = c.req.valid("json");

	const [user] = await db
		.select({ id: users.id })
		.from(users)
		.where(eq(users.id, userId));
	if (!user) {
		throw new HTTPException(404, { message: `User ${userId} not found` });
	}

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
