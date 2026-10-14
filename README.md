# PATHASHALA AI — Local Development

## Requirements
- Node.js 20+ (Node.js 22+ recommended)
- npm
- A Gemini API key is optional. The app has a local curriculum fallback when it is not configured.

## Run the full app on localhost

From the repository root:

```bash
npm install
npm run dev
```

Open **http://localhost:3000**. The Express server starts on port 3000 and mounts the Vite development middleware, so the frontend and `/api/*` endpoints share the same origin.

Check backend status at **http://localhost:3000/api/health**.

## Demo sign-in accounts

Choose the appropriate portal on the login screen. These seeded prototype accounts are available:

| Portal | Email / identifier | Password |
| --- | --- | --- |
| Student | `subha@pathashala.edu` | `password123` |
| Teacher | `priya.sharma@pathashala.edu` | `password123` |
| Parent | `ananya.nayak@pathashala.edu` | `password123` |

When `DATABASE_URL` is configured, users, homework, submissions, and class recordings are persisted in PostgreSQL (including Neon) using the SQL migration in `migrations/001_initial.sql`. The app seeds those tables with the existing demo data only when each table is empty, then uses PostgreSQL as the shared source of truth. Other prototype datasets continue to use `.pathashala-data.json`. Without `DATABASE_URL`, the app falls back to that local JSON file; cloud filesystems may be ephemeral.

The API validates login credentials, registration roles and class numbers, rejects duplicate email addresses, and persists homework, submissions, users, and recordings in PostgreSQL when configured. Alerts, reports, activities, and notifications remain in the local JSON store for now. Registration requires a password of at least 8 characters. Passwords are stored with Node.js scrypt hashing, including an automatic migration of existing plain-text demo passwords when the server starts. Login returns an HMAC-SHA256 signed token with an eight-hour expiry. Configure `PATHASHALA_AUTH_SECRET` to a strong random secret in deployment settings; if omitted, a temporary secret is generated at startup and tokens will stop working after a restart.

**Production warning:** this project remains a prototype. Signed tokens are issued but the current API routes do not yet consistently verify them or enforce role-based authorization. The JSON file store is not a managed database. Do not use real student records until token verification, endpoint authorization, secure session handling, and a managed database are implemented.

## Connect an existing Neon PostgreSQL database

1. In the Neon Console, open your project and select **Connect**.
2. Copy the connection string for your database. Prefer the pooled connection string for serverless deployments, and make sure SSL is required.
3. Add it as `DATABASE_URL` in your local `.env` (copy `.env.example` first) and in your hosting provider's environment variables. Never commit `.env` or paste the real connection string into source code or chat.
4. Install dependencies with `npm install`, then run `npm run dev`. The server applies `migrations/001_initial.sql` automatically at startup and reports whether Neon is connected at `/api/health`.
5. On first connection, existing demo users, homework, submissions, and recordings seed only empty corresponding tables. Existing non-empty Neon tables remain authoritative.

To test connectivity without exposing credentials, open `/api/health` and check `databaseConnected` and `database`. Do not use real student data until authentication middleware and role-based authorization are completed.

## Optional: run Vite separately

If you want a separate Vite dev server, start the API server in one terminal and run:

```bash
npm run dev:client
```

Open the Vite URL it prints (normally **http://127.0.0.1:5173**). The Vite config proxies `/api` requests to port 3000.

## Gemini AI

Copy `.env.example` to `.env` and set `GEMINI_API_KEY` to enable live Gemini responses. Keep the real key private and do not commit `.env`.
