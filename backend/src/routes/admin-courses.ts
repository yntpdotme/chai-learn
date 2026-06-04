import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

import { db } from "#db/index.js";
import {
	courses,
	createCourseSchema,
	createLessonSchema,
	lessons,
	updateCourseSchema,
} from "#db/schema/index.js";
import { parseUuidParam } from "#lib/params.js";
import { requireAdmin, requireAuth } from "#middleware/index.js";
import type { AppVariables } from "#types.js";

export const adminCoursesRoute = new Hono<{ Variables: AppVariables }>();

adminCoursesRoute.use("*", requireAuth, requireAdmin);

// POST /api/admin/courses
adminCoursesRoute.post(
	"/",
	zValidator("json", createCourseSchema),
	async (c) => {
		const input = c.req.valid("json");
		const [created] = await db.insert(courses).values(input).returning();
		return c.json({ data: created }, 201);
	},
);

// PATCH /api/admin/courses/:id
adminCoursesRoute.patch(
	"/:id",
	zValidator("json", updateCourseSchema),
	async (c) => {
		const id = parseUuidParam(c.req.param("id"));
		const input = c.req.valid("json");

		const [updated] = await db
			.update(courses)
			.set(input)
			.where(eq(courses.id, id))
			.returning();

		if (!updated) {
			throw new HTTPException(404, { message: `Course ${id} not found` });
		}

		return c.json({ data: updated });
	},
);

// POST /api/admin/courses/:courseId/lessons
adminCoursesRoute.post(
	"/:courseId/lessons",
	zValidator("json", createLessonSchema),
	async (c) => {
		const courseId = parseUuidParam(c.req.param("courseId"));

		const [course] = await db
			.select({ id: courses.id })
			.from(courses)
			.where(eq(courses.id, courseId));

		if (!course) {
			throw new HTTPException(404, { message: `Course ${courseId} not found` });
		}

		const input = c.req.valid("json");
		const [created] = await db
			.insert(lessons)
			.values({ ...input, courseId })
			.returning();

		return c.json({ data: created }, 201);
	},
);

// DELETE /api/admin/courses/:id — cascades to lessons + progress via FK constraints
adminCoursesRoute.delete("/:id", async (c) => {
	const id = parseUuidParam(c.req.param("id"));

	const [deleted] = await db
		.delete(courses)
		.where(eq(courses.id, id))
		.returning();

	if (!deleted) {
		throw new HTTPException(404, { message: `Course ${id} not found` });
	}

	return c.body(null, 204);
});