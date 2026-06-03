import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import z from "zod";

export const courses = pgTable("courses", {
	id: uuid("id").defaultRandom().primaryKey(),
	title: text("title").notNull(),
	slug: text("slug").notNull().unique(),
	description: text("description"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const createCourseSchema = z.object({
	title: z.string().min(2),
	slug: z
		.string()
		.min(2)
		.regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only"),
	description: z.string().optional(),
});

export const updateCourseSchema = createCourseSchema.partial();
