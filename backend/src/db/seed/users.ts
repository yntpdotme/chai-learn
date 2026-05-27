import { db } from "../index.js";
import { users } from "../schema/users.js";

export async function seedUsers() {
	await db
		.insert(users)
		.values([
			{
				name: "Admin User",
				email: "admin@chailearn.dev",
				role: "admin",
			},
			{
				name: "Demo Student",
				email: "student@chailearn.dev",
				role: "student",
			},
		])
		.onConflictDoNothing();

	console.log("  ↳ users seeded");
}
