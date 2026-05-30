// Path: src/types.ts
import type { auth } from "#lib/auth.js";

export type AppVariables = {
	user: (typeof auth.$Infer.Session)["user"] | null;
	session: (typeof auth.$Infer.Session)["session"] | null;
};
