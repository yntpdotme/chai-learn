# ChaiLearn

ChaiLearn is a learning platform where users can browse courses, view lessons, and track their learning progress.

## Tech Stack

### Frontend

- React
- TypeScript
- TanStack Start
- TanStack Router
- TanStack Form
- Tailwind CSS
- shadcn/ui

### Backend

- Hono
- Node.js
- TypeScript

### Database

- PostgreSQL
- Drizzle ORM
- Neon PostgreSQL

## Repository Structure

```text
chai-learn/
├── frontend/
└── backend/
```

## Prerequisites

- Node.js
- pnpm
- Access to a PostgreSQL database

## Environment Variables

Each app ships `.env.example` (shared/local defaults) and `.env.production.example`
(production overrides). Copy the one you need and fill in the values:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Do not commit `.env` files or secrets. Only the `*.example` templates are tracked.

### Backend

```env
NODE_ENV=development          # development | production | test
PORT=3000

# Database
DATABASE_URL=                 # PostgreSQL connection string (Neon)

# Better Auth
BETTER_AUTH_URL=http://localhost:3000     # public URL the backend is served at
BETTER_AUTH_SECRET=                       # openssl rand -base64 32  (min 32 chars)
FRONTEND_URL=http://localhost:3001        # exact origin, used for CORS + trusted origins
```

The backend loads env files by `NODE_ENV`, in precedence order (first to set a
key wins):

```text
.env.<NODE_ENV>.local  →  .env.local  →  .env.<NODE_ENV>  →  .env
```

So `.env.production` overrides `.env` when `NODE_ENV=production`, and anything it
omits falls back to `.env`.

### Frontend

```env
VITE_API_URL=http://localhost:3000        # backend base URL
```

Vite loads `.env` / `.env.local` in dev and `.env.production` / `.env.production.local`
on `pnpm build`. `VITE_`-prefixed vars are baked into the client bundle — never put
secrets here.

## Setup

Clone the repository:

```bash
git clone <repository-url>
cd chai-learn
```

Install frontend dependencies:

```bash
cd frontend
pnpm install
```

Install backend dependencies:

```bash
cd ../backend
pnpm install
```

## Database Setup

Make sure the `DATABASE_URL` points to the PostgreSQL database.

Run database migrations from the backend:

```bash
cd backend
pnpm db:migrate
```

If seed data is available:

```bash
pnpm db:seed
```

## Run Locally

Start the backend:

```bash
cd backend
pnpm dev
```

Start the frontend in another terminal:

```bash
cd frontend
pnpm dev
```

The frontend and backend run as separate applications during development.

## Production

Create the production env files from the templates and fill them in (or set the
same variables directly in the host's environment):

```bash
cp backend/.env.production.example backend/.env.production
cp frontend/.env.production.example frontend/.env.production
```

Frontend — `pnpm build` runs in Vite's `production` mode and picks up
`frontend/.env.production` automatically:

```bash
cd frontend
pnpm build
pnpm start
```

Backend — set `NODE_ENV=production` so `backend/.env.production` is loaded on top
of `.env`:

```bash
cd backend
NODE_ENV=production pnpm start
```

Refer to the backend and frontend package scripts for the available development and production commands.