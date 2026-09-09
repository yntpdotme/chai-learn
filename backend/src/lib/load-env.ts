// Path: src/lib/load-env.ts
// Side-effect module: load environment variables before anything reads them.
// Import this first (env.ts already does) — never read process.env before it runs.
import { config } from "dotenv";

const nodeEnv = process.env.NODE_ENV ?? "development";

// Convention (same precedence Vite/Next use): the first file to set a given
// key wins, so machine-specific `.local` overrides beat the committed defaults.
//   .env.<mode>.local   →  local overrides for this mode      (gitignored)
//   .env.local          →  local overrides for every mode     (gitignored, skipped in test)
//   .env.<mode>         →  defaults for this mode              (gitignored)
//   .env                →  shared defaults / local dev        (gitignored)
const paths = [
	`.env.${nodeEnv}.local`,
	nodeEnv === "test" ? null : ".env.local",
	`.env.${nodeEnv}`,
	".env",
].filter((p): p is string => p !== null);

config({ path: paths, quiet: true });
