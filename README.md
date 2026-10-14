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

The backend saves successful API mutations to `.pathashala-data.json` and reloads them at startup, so local demo records survive a server restart. This is a lightweight prototype store, **not a replacement for PostgreSQL or another managed database**. On cloud hosts with ephemeral filesystems, data can still be lost on redeploy/restart unless a persistent disk is configured. Set `PATHASHALA_DATA_FILE` to choose a different file path.

The API validates login credentials, registration roles and class numbers, rejects duplicate email addresses, and persists homework, alerts, reports, activities, and notifications. Registration requires a password of at least 8 characters. Passwords are stored with Node.js scrypt hashing, including an automatic migration of existing plain-text demo passwords when the server starts. Login returns an HMAC-SHA256 signed token with an eight-hour expiry. Configure `PATHASHALA_AUTH_SECRET` to a strong random secret in deployment settings; if omitted, a temporary secret is generated at startup and tokens will stop working after a restart.

**Production warning:** this project remains a prototype. Signed tokens are issued but the current API routes do not yet consistently verify them or enforce role-based authorization. The JSON file store is not a managed database. Do not use real student records until token verification, endpoint authorization, secure session handling, and a managed database are implemented.

## Optional: run Vite separately

If you want a separate Vite dev server, start the API server in one terminal and run:

```bash
npm run dev:client
```

Open the Vite URL it prints (normally **http://127.0.0.1:5173**). The Vite config proxies `/api` requests to port 3000.

## Gemini AI

Copy `.env.example` to `.env` and set `GEMINI_API_KEY` to enable live Gemini responses. Keep the real key private and do not commit `.env`.
