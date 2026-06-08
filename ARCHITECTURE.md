# ChaiLearn Architecture

## Overview

ChaiLearn consists of a frontend application, a backend API, and a PostgreSQL database.

```text
                    Browser
                       │
                       │ HTTP
                       ▼
              ┌─────────────────┐
              │    Frontend     │
              │ React + TS      │
              │ TanStack Start  │
              └────────┬────────┘
                       │
                       │ HTTP API
                       ▼
              ┌─────────────────┐
              │     Backend     │
              │ Hono + Node.js  │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │     Drizzle     │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │   PostgreSQL    │
              │      Neon       │
              └─────────────────┘
```

## Frontend

The frontend is responsible for:

- User interface
- Client-side navigation
- Forms
- Course and lesson views
- User interaction
- Communicating with the backend API

The frontend does not connect directly to the database.

## Backend

The backend is responsible for:

- HTTP API
- Authentication
- Request validation
- Application logic
- Database access

The backend communicates with PostgreSQL through Drizzle ORM.

## Database

PostgreSQL stores the application's persistent data.

The initial data model consists of:

```text
users
courses
lessons
progress
```

Relationships:

```text
users
  │
  └── progress
          │
          ▼
       lessons
          │
          ▼
       courses
```

## Request Flow

A typical request follows this path:

```text
Browser
   │
   ▼
Frontend
   │
   ▼
Hono API
   │
   ▼
Application Logic
   │
   ▼
Drizzle
   │
   ▼
PostgreSQL
```

The response follows the same path in reverse.

## Repository Structure

```text
chai-learn/
│
├── frontend/
│   └── React application
│
├── backend/
│   └── Hono API
│
├── README.md
└── ARCHITECTURE.md
```

## Current Deployment

The application currently uses Neon PostgreSQL as its database.

The frontend and backend are developed and run as separate applications.