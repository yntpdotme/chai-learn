import { z } from "zod";

const envSchema = z.object({
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	PORT: z.coerce.number().default(3000),
	DATABASE_URL: z.url(),
});

// Fails fast on boot if required env vars are missing/invalid,
// instead of failing later on the first DB query.
export const env = envSchema.parse(process.env);

export const isProd = env.NODE_ENV === "production";
