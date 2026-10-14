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

The API now checks demo/account passwords, validates registration roles and class numbers, rejects duplicate email addresses, and persists homework, alerts, reports, activities, and notifications. Registration requires a password of at least 8 characters.

**Production warning:** this project is still a prototype. Demo passwords are stored as plain text in the local data store, returned login tokens are not signed sessions, and most API routes do not yet enforce authenticated role-based access. Do not put real student data on a public deployment until password hashing, signed sessions, authorization checks, and a managed database are implemented.

## Optional: run Vite separately

If you want a separate Vite dev server, start the API server in one terminal and run:

```bash
npm run dev:client
```

Open the Vite URL it prints (normally **http://127.0.0.1:5173**). The Vite config proxies `/api` requests to port 3000.

## Gemini AI

Copy `.env.example` to `.env` and set `GEMINI_API_KEY` to enable live Gemini responses. Keep the real key private and do not commit `.env`.
