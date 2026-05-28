import { pgTable, uuid, text, integer, timestamp } from "drizzle-orm/pg-core";
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
