import { pgTable, uuid, boolean, timestamp, unique } from "drizzle-orm/pg-core";
import { lessons } from "#db/schema/lessons.js";
import { users } from "#db/schema/users.js";
import z from "zod";
export const progress = pgTable("progress", {
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
}, (table) => ({
    userLessonUnique: unique().on(table.userId, table.lessonId),
}));
export const upsertProgressSchema = z.object({
    userId: z.string().uuid(),
    lessonId: z.string().uuid(),
    completed: z.boolean(),
});
