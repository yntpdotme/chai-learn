import { count, eq } from "drizzle-orm";
import { Hono } from "hono";

import { db } from "#db/index.ts";
import { courses, lessons, progress, users } from "#db/schema/index.ts"; // ← confirm "user" is the real export name
import { requireAdmin, requireAuth } from "#middleware/index.ts";
import type { AppVariables } from "#types.ts";

export const adminStatsRoute = new Hono<{ Variables: AppVariables }>();

adminStatsRoute.use("*", requireAuth, requireAdmin);

// GET /api/admin/stats
adminStatsRoute.get("/", async (c) => {
	const [[coursesCount], [lessonsCount], [studentsCount], [completionsCount]] =
		await Promise.all([
			db.select({ value: count() }).from(courses),
			db.select({ value: count() }).from(lessons),
			db
				.select({ value: count() })
				.from(users)
				.where(eq(users.role, "student")),
			db
				.select({ value: count() })
				.from(progress)
				.where(eq(progress.completed, true)),
		]);

	return c.json({
		data: {
			courses: coursesCount.value,
			lessons: lessonsCount.value,
			students: studentsCount.value,
			completions: completionsCount.value,
		},
	});
});
