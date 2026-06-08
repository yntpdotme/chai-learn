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

Copy the example environment file and fill in the required values in .env

### Backend 

```env
DATABASE_URL=
```

Add other application secrets required by the backend environment.

Do not commit `.env` files or secrets to the repository.

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

Frontend:

```bash
cd frontend
pnpm build
pnpm start
```

Backend:

```bash
cd backend
pnpm start
```

Refer to the backend and frontend package scripts for the available development and production commands.