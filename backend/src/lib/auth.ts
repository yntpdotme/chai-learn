// Path: src/lib/auth.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "#db/index.ts";
import { accounts, sessions, users, verifications } from "#db/schema/index.ts";
import { env } from "#env.ts";

export const auth = betterAuth({
	baseURL: env.BETTER_AUTH_URL,
	secret: env.BETTER_AUTH_SECRET,
	trustedOrigins: [env.FRONTEND_URL],

	database: drizzleAdapter(db, {
		provider: "pg",
		schema: {
			user: users,
			session: sessions,
			account: accounts,
			verification: verifications,
		},
	}),

	// Our tables use uuid().defaultRandom() as the id source rather than
	// Better Auth's own id generator — this tells it to let Postgres
	// handle id generation on insert instead of generating its own.
	advanced: {
		database: {
			generateId: false,
		},
	},

	emailAndPassword: {
		enabled: true,
	},

	// `role` isn't part of Better Auth's default user model — this maps
	// it onto our existing `role` column and, importantly, sets input:false
	// so a client can't set their own role at sign-up time.
	user: {
		additionalFields: {
			role: {
				type: "string",
				defaultValue: "student",
				input: false,
			},
		},
	},
});

export type Session = typeof auth.$Infer.Session;
