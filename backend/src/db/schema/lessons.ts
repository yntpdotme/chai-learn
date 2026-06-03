import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import z from "zod";

import { courses } from "#db/schema/courses.js";

export const lessons = pgTable("lessons", {
	id: uuid("id").defaultRandom().primaryKey(),
	courseId: uuid("course_id")
		.notNull()
		.references(() => courses.id, { onDelete: "cascade" }),
	title: text("title").notNull(),
	content: text("content").notNull(),
	order: integer("order").notNull().default(0),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const createLessonSchema = z.object({
	title: z.string().min(2),
	content: z.string().min(1),
	order: z.number().int().min(1),
});

export const updateLessonSchema = createLessonSchema.partial();
