import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import { db } from "#db/index.js";
import { courses, lessons } from "#db/schema/index.js";
import { parseUuidParam } from "#lib/params.js";
export const coursesRoute = new Hono();
// GET /api/courses
coursesRoute.get("/", async (c) => {
    const allCourses = await db.select().from(courses);
    return c.json({ data: allCourses });
});
// GET /api/courses/:id — includes its lessons, ordered.
coursesRoute.get("/:id", async (c) => {
    const id = parseUuidParam(c.req.param("id"));
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    if (!course) {
        throw new HTTPException(404, { message: `Course ${id} not found` });
    }
    const courseLessons = await db
        .select()
        .from(lessons)
        .where(eq(lessons.courseId, id))
        .orderBy(lessons.order);
    return c.json({ data: { ...course, lessons: courseLessons } });
});
