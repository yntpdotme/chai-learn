// Path: apps/backend/src/index.ts
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { env } from "./env.js";
import { errorHandler, notFoundHandler } from "./middleware/error-handler.js";
import { requestLogger } from "./middleware/logger.js";
import { coursesRoute } from "./routes/courses.js";
import { healthRoute } from "./routes/health.js";
import { lessonsRoute } from "./routes/lessons.js";
import { progressRoute } from "./routes/progress.js";

const app = new Hono();

app.use("*", requestLogger);
app.use("*", cors()); // tighten origin allowlist once the frontend URL is fixed (Phase 6/7)

app.route("/api/health", healthRoute);
app.route("/api/courses", coursesRoute);
app.route("/api/lessons", lessonsRoute);
app.route("/api/progress", progressRoute);

app.onError(errorHandler);
app.notFound(notFoundHandler);

serve({ fetch: app.fetch, port: env.PORT }, (info) => {
	console.log(`Chai-Learn API running at http://localhost:${info.port}`);
});
