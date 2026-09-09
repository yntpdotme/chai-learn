# ChaiLearn

A small learning platform — browse courses, read lessons, and track your
progress. It is the reference application for a DevOps deployment course, so the
codebase is deliberately simple and the focus is on running it well.

## Features

- Course catalog and course detail pages with an ordered lesson list
- Lesson pages with a "mark complete" action; completion is reflected back on the
  course and lesson pages
- Email/password authentication (sign up, sign in, sign out) with cookie sessions
- Two roles: `student` (default) and `admin`
- Admin area (admin only): dashboard counts, plus create/edit/delete for courses
  and lessons
- Light / dark / system theme
- `GET /api/health` that checks database connectivity — for uptime and
  load-balancer probes
- Structured JSON request and error logs on stdout

## Tech Stack

**Frontend** — React 19, TypeScript, TanStack Start / Router / Form, Tailwind CSS
v4, Base UI. Runs in production as a Node SSR server (Nitro).

**Backend** — Hono on Node.js, TypeScript executed directly (no build step), Zod
validation, Better Auth.

**Database** — PostgreSQL (Neon) via Drizzle ORM; migrations with `drizzle-kit`.

See [ARCHITECTURE.md](./ARCHITECTURE.md) for how the pieces fit together.

## Repository Structure

```text
chai-learn/
├── frontend/                 # React app (TanStack Start)
│   └── src/
│       ├── routes/           # file-based routes
│       ├── features/         # feature UI (auth, admin)
│       ├── components/
│       └── lib/              # API client, auth client
├── backend/                  # Hono API
│   └── src/
│       ├── routes/           # API route groups
│       ├── middleware/       # auth, logging, error handling
│       ├── db/
│       │   ├── schema/       # Drizzle tables
│       │   ├── migrations/   # generated SQL
│       │   └── seed/         # seed script
│       └── lib/              # auth config, env loader
├── README.md
└── ARCHITECTURE.md
```

## Prerequisites

- Node.js 22.18+ or 24 (the backend runs TypeScript directly)
- pnpm 10+
- A PostgreSQL database — Neon, or any Postgres 14+

## Local Development

The frontend and backend are separate apps. Backend runs on port `3000`, frontend
on `3001`.

### 1. Backend

```bash
cd backend
pnpm install
cp .env.example .env
```

Fill in `backend/.env`:

```env
NODE_ENV=development
PORT=3000

# Database — a single Postgres connection string
DATABASE_URL=

# Better Auth
BETTER_AUTH_URL=http://localhost:3000   # URL the API is served at
BETTER_AUTH_SECRET=                     # openssl rand -base64 32  (min 32 chars)
FRONTEND_URL=http://localhost:3001      # exact origin; used for CORS + auth trusted origins
```

Set up the database (see [Database](#database)), then start the API:

```bash
pnpm dev
```

### 2. Frontend

```bash
cd frontend
pnpm install
cp .env.example .env
```

Fill in `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000     # backend base URL
```

```bash
pnpm dev
```

Open <http://localhost:3001>.

## Database

The backend reads one variable, `DATABASE_URL`. Everything else is done with
`drizzle-kit` from `backend/`:

| Command | What it does |
| --- | --- |
| `pnpm db:migrate` | Apply pending migrations from `src/db/migrations/` |
| `pnpm db:generate` | Generate a new migration after editing `src/db/schema/` |
| `pnpm db:push` | Push the schema to the DB without a migration (dev only) |
| `pnpm db:studio` | Open Drizzle Studio |
| `pnpm db:seed` | Insert sample data |

First-time setup:

```bash
cd backend
pnpm db:migrate
pnpm db:seed
```

`pnpm db:seed` is idempotent and creates:

- sample courses with their lessons
- two dev accounts:
  - `admin@chailearn.dev` / `admin@yntp.me` — admin
  - `student@chailearn.dev` / `student@chailearn` — student

Tables: `users`, `courses`, `lessons`, `progress`, plus Better Auth's `sessions`,
`accounts`, `verifications`.

## API

All routes are under `/api` and return JSON.

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| GET | `/api/health` | — | DB connectivity check; `503` if the DB is unreachable |
| `*` | `/api/auth/**` | — | Better Auth (sign up / in / out, session) |
| GET | `/api/courses` | — | List courses |
| GET | `/api/courses/:id` | — | Course with ordered lessons |
| GET | `/api/lessons/:id` | — | Single lesson |
| GET | `/api/me` | user | Current user |
| GET | `/api/progress` | user | Current user's progress rows |
| POST | `/api/progress` | user | Mark a lesson complete / incomplete |
| GET | `/api/admin/stats` | admin | Course / lesson / student / completion counts |
| POST | `/api/admin/courses` | admin | Create course |
| PATCH · DELETE | `/api/admin/courses/:id` | admin | Update / delete course |
| POST | `/api/admin/courses/:courseId/lessons` | admin | Create lesson |
| PATCH · DELETE | `/api/admin/lessons/:id` | admin | Update / delete lesson |

## Production

### Environment

Each app has a `.env.production.example`. Copy it and fill it in, or set the same
variables directly in the host / orchestrator environment (preferred for
secrets):

```bash
cp backend/.env.production.example backend/.env.production
cp frontend/.env.production.example frontend/.env.production
```

**Backend** loads env files by `NODE_ENV`, in this precedence (first to set a key
wins):

```text
.env.<NODE_ENV>.local  →  .env.local  →  .env.<NODE_ENV>  →  .env
```

Run it with `NODE_ENV=production` so `.env.production` layers over `.env`. Set
`DATABASE_URL`, `BETTER_AUTH_SECRET`, and the real URLs there —
`FRONTEND_URL` must be an exact origin (no wildcard) because sessions are
cookie-based.

**Frontend** — `pnpm build` runs in Vite's `production` mode and reads
`frontend/.env.production` **at build time**. `VITE_`-prefixed values are baked
into the client bundle and are therefore public — never put secrets there. Set
`VITE_API_URL` to the deployed backend URL before building.

### Build & run

```bash
# 1. Database
cd backend
NODE_ENV=production pnpm db:migrate:prod

# 2. Backend — Node process, no build step, listens on $PORT (3000)
NODE_ENV=production pnpm start

# 3. Frontend — build once, then run the Node SSR server on 3001
cd ../frontend
pnpm build
pnpm start
```

### Operational notes

- **Health check:** `GET /api/health` returns `200` with
  `{ status: "ok", database: "connected" }`, or `503` when the database is
  unreachable. Use it for load-balancer and uptime probes.
- **Logs:** one JSON line per request on stdout (`method`, `path`, `status`,
  `ms`), plus JSON error logs on failures — ready for `journalctl` or a log
  shipper.
- **Processes:** both apps are long-running Node processes. Run them under a
  supervisor (systemd, PM2, a container runtime).
- **Networking:** the frontend server calls the backend over HTTP. Put both
  behind your reverse proxy / TLS terminator, and keep `FRONTEND_URL` /
  `VITE_API_URL` / `BETTER_AUTH_URL` consistent with the public URLs.

## Scripts

### Backend (`backend/`)

| Script | |
| --- | --- |
| `pnpm dev` | Watch mode |
| `pnpm start` | Run the API |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm check` · `lint` · `format` | Biome |
| `pnpm db:*` | See [Database](#database) |

### Frontend (`frontend/`)

| Script | |
| --- | --- |
| `pnpm dev` | Dev server on `:3001` |
| `pnpm build` | Production build (`.output/`) |
| `pnpm start` | Run the built SSR server on `:3001` |
| `pnpm preview` | Preview the build |
| `pnpm generate-routes` | Regenerate the route tree |
| `pnpm check` · `lint` · `format` | Biome |
