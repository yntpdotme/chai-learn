import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
export const courses = pgTable("courses", {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});
