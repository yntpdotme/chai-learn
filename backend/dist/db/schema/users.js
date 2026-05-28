import { pgTable, uuid, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
export const roleEnum = pgEnum("role", ["student", "admin"]);
export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    role: roleEnum("role").notNull().default("student"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});
