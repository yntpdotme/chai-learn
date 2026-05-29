// Path: /src/env.ts
import { z } from "zod";

const envSchema = z.object({
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	PORT: z.coerce.number().default(3000),
	DATABASE_URL: z.url(),
	// Generate with: openssl rand -base64 32
	BETTER_AUTH_SECRET: z
		.string()
		.min(32, "BETTER_AUTH_SECRET must be at least 32 characters"),
	BETTER_AUTH_URL: z.url().default("http://localhost:3000"),
	// Used for CORS + Better Auth's trustedOrigins — must be an exact origin,
	// not "*", since cookie-based sessions require credentials: true.
	FRONTEND_URL: z.url().default("http://localhost:3001"),
});

// Fails fast on boot if required env vars are missing/invalid,
// instead of failing later on the first DB query.
export const env = envSchema.parse(process.env);

export const isProd = env.NODE_ENV === "production";