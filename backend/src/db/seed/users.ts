// Path: src/db/seed/dev/users.ts
import { eq } from "drizzle-orm";
import { db } from "#db/index.js";
import { users } from "#db/schema/index.js";
import { auth } from "#lib/auth.js";

// Dev-only credentials — never real passwords, never used outside seeding.
const DEV_USERS = [
	{
		name: "Admin User",
		email: "admin@chailearn.dev",
		password: "admin@yntp.me",
		role: "admin" as const,
	},
	{
		name: "Demo Student",
		email: "student@chailearn.dev",
		password: "student@chailearn",
		role: "student" as const,
	},
];

export async function seedUsers() {
	for (const devUser of DEV_USERS) {
		const [existing] = await db
			.select({ id: users.id })
			.from(users)
			.where(eq(users.email, devUser.email));

		if (existing) {
			console.log(`  ↳ user ${devUser.email} already exists, skipping`);
			continue;
		}

		// Goes through Better Auth's own sign-up flow rather than db.insert(),
		// so it creates both the `users` row AND the matching `accounts` row
		// with a correctly-hashed password — a raw insert can't produce that.
		await auth.api.signUpEmail({
			body: {
				name: devUser.name,
				email: devUser.email,
				password: devUser.password,
			},
		});

		// Dummy dev inbox — nothing will ever click a real verification link,
		// so mark verified directly rather than faking the email flow.
		await db
			.update(users)
			.set({ emailVerified: true })
			.where(eq(users.email, devUser.email));

		// signUpEmail always creates the user with the default role
		// ("student"), since role is set with input:false. Promote after.
		if (devUser.role === "admin") {
			await db
				.update(users)
				.set({ role: "admin" })
				.where(eq(users.email, devUser.email));
		}
	}

	console.log(
		"  ↳ users seeded — see DEV_USERS in this file for login credentials (dev only)",
	);
}
