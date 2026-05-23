# VivaFemini — Menstrual Health Tracker

Full-stack menstrual health app: track symptoms, view cycle insights, and explore a monthly health report. Built against the [VivaFemini Figma design](https://www.figma.com/design/EUtC3IAC9ZPqKsWayxIesg/VivaFemini-Test).

## Tech stack

| Layer | Technologies |
|-------|----------------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, Recharts |
| Backend | NestJS 10, TypeScript, Mongoose |
| Database | MongoDB |
| API docs | Swagger (`/api/docs`) |

## Features

| Page | Description |
|------|-------------|
| **Home** | Calendar (month navigation, date selection), cycle day, quick actions, tips carousel, recommended articles |
| **Tracking** | Symptom logging by date (create/update), flow intensity, notes, log period |
| **Health Report** | Cycle summary, charts, symptom frequency, historical table (edit/delete) |

All screen data is loaded from the NestJS API and stored in MongoDB (no hard-coded dashboard content).

## Architecture

```
Browser (Next.js)
    │  REST / JSON
    ▼
NestJS API (/api)
    │  Mongoose
    ▼
MongoDB
```

**Backend modules:** `users`, `cycle`, `symptoms`, `health-report`, `dashboard` (aggregate for Home), `articles`, `cycle-tips`, `seed`.

**Frontend layout:** `src/app` (pages), `src/components` (UI by feature), `src/hooks` (data fetching), `src/lib/api.ts` (HTTP client).

**Auth:** Single demo user via `NEXT_PUBLIC_USER_ID` after seeding (no login flow).

## Prerequisites

- Node.js 18+
- MongoDB (Atlas or local)

## Local setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env`:

```env
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
PORT=3001
FRONTEND_URL=http://localhost:3000
```

```bash
npm run start:dev
```

API: http://localhost:3001/api  
Swagger: http://localhost:3001/api/docs

### 2. Seed the database

With the backend running:

```bash
curl -X POST http://localhost:3001/api/seed
```

Response includes `userId`. Demo data uses **dates relative to today** (current cycle month).

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
```

Edit `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_USER_ID=<userId-from-seed-response>
```

```bash
npm run dev
```

App: http://localhost:3000

Restart the frontend after changing `NEXT_PUBLIC_USER_ID`.

## Environment variables

| Variable | Where | Description |
|----------|--------|-------------|
| `MONGODB_URI` | backend `.env` | MongoDB connection string |
| `PORT` | backend `.env` | API port (default `3001`) |
| `FRONTEND_URL` | backend `.env` | CORS origin (default `http://localhost:3000`) |
| `NEXT_PUBLIC_API_URL` | frontend `.env.local` | Backend base URL |
| `NEXT_PUBLIC_USER_ID` | frontend `.env.local` | User ID from seed response |

## API overview

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/api/seed` | Reset DB and insert sample data |
| `GET` | `/api/dashboard/:userId` | Home page payload |
| `GET` | `/api/cycle/:userId/summary` | Cycle & calendar summary |
| `POST` | `/api/cycle/:userId/log` | Log period start |
| `GET` | `/api/symptoms/:userId` | List logs (`?month=YYYY-MM`) |
| `POST` | `/api/symptoms/:userId` | Create symptom log |
| `PATCH` | `/api/symptoms/:userId/:logId` | Update symptom log |
| `DELETE` | `/api/symptoms/:userId/:logId` | Delete symptom log |
| `GET` | `/api/health-report/:userId` | Health report (`?month=YYYY-MM`) |
| `PATCH` | `/api/users/:id` | Update profile / widget preferences |
| `GET` | `/api/articles` | Articles (also via dashboard) |

Full interactive docs: http://localhost:3001/api/docs

## NPM scripts

| Location | Command | Description |
|----------|---------|-------------|
| `backend/` | `npm run start:dev` | API with hot reload |
| `backend/` | `npm run build` | Compile to `dist/` |
| `backend/` | `npm run test:e2e` | API e2e tests (requires MongoDB) |
| `frontend/` | `npm run dev` | Next.js dev server |
| `frontend/` | `npm run build` | Production build |
| `frontend/` | `npm run lint` | ESLint |

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Empty home or API errors | Run `POST /api/seed` and set `NEXT_PUBLIC_USER_ID` |
| CORS blocked | Set `FRONTEND_URL=http://localhost:3000` in `backend/.env` |
| Health report has no rows | Re-seed; logs are created for the **current month** |
| Backend fails on start | Verify `MONGODB_URI` and network access to MongoDB |

## Project structure

```
vivafemini/
├── backend/          # NestJS API
│   ├── src/
│   └── test/         # e2e tests
├── frontend/         # Next.js app
│   └── src/
├── README.md
└── .gitignore
```

## Known limitations

- Single-user demo (no registration/login).
- Symptom labels are defined in frontend constants; log **values** are persisted in MongoDB.
- Settings and notification buttons are UI placeholders.

## Deployment (optional)

- **Frontend:** Vercel — root directory `frontend`, set `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_USER_ID`.
- **Backend:** Railway/Render — root directory `backend`, set `MONGODB_URI` and `FRONTEND_URL` to your deployed frontend URL.

## License

Private / assessment submission — update as needed.
