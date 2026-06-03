// Path: apps/backend/src/index.ts
import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { env } from "#env.js";
import { auth } from "#lib/auth.js";
import {
	attachSession,
	errorHandler,
	notFoundHandler,
	requestLogger,
} from "#middleware/index.js";
import {
	adminCoursesRoute,
	adminLessonsRoute,
	coursesRoute,
	healthRoute,
	lessonsRoute,
	meRoute,
	progressRoute,
} from "#routes/index.js";
import type { AppVariables } from "#types.js";

const app = new Hono<{ Variables: AppVariables }>();

app.use("*", requestLogger);
app.use(
	"*",
	cors({
		origin: env.FRONTEND_URL, // must be an exact origin (not "*") for cookie-based sessions
		credentials: true,
	}),
);
app.use("*", attachSession);

// Better Auth owns this whole path — handles register, login, logout,
// session, and current-user internally. Nothing else to build for those.
app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));

app.route("/api/health", healthRoute);
app.route("/api/courses", coursesRoute);
app.route("/api/lessons", lessonsRoute);
app.route("/api/progress", progressRoute);
app.route("/api/me", meRoute);
app.route("/api/admin/courses", adminCoursesRoute);
app.route("/api/admin/lessons", adminLessonsRoute);

app.onError(errorHandler);
app.notFound(notFoundHandler);

serve({ fetch: app.fetch, port: env.PORT }, (info) => {
	console.log(`🚀 ChaiLearn API running at http://localhost:${info.port}`);
});
