import { pgTable, uuid, boolean, timestamp, unique } from "drizzle-orm/pg-core";
import { lessons } from "#db/schema/lessons.ts";
import { users } from "#db/schema/users.ts";
import z from "zod";

export const progress = pgTable(
	"progress",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		lessonId: uuid("lesson_id")
			.notNull()
			.references(() => lessons.id, { onDelete: "cascade" }),
		completed: boolean("completed").notNull().default(false),
		completedAt: timestamp("completed_at"),
		createdAt: timestamp("created_at").notNull().defaultNow(),
	},
	(table) => ({
		userLessonUnique: unique().on(table.userId, table.lessonId),
	}),
);

// userId is taken from the session, never the request body.
export const upsertProgressSchema = z.object({
	lessonId: z.string().uuid(),
	completed: z.boolean(),
});

export type UpsertProgressInput = z.infer<typeof upsertProgressSchema>;
