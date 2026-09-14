# f1simulatorapi

The **external F1 data provider** for the *F1 Race Strategist* take-home challenge.

Candidates build their own full-stack application and consume this API over HTTP from their own backend. See [`CHALLENGE.md`](CHALLENGE.md) for the candidate-facing brief, and [`backend/README.md`](backend/README.md) for the full API reference.

> This API is intentionally a simplified fictional F1 data provider for a coding challenge. It is not intended to model real Formula 1 physics or performance.

Key properties:

- **Read-only.** Every endpoint is a `GET`.
- **Open.** No authentication, no user model.
- **No database.** All data is hardcoded JSON under `backend/src/data/`.
- **Deterministic.** The same request always returns the same data.
- **No simulation endpoint.** The API provides data and parameters; candidates build the simulation.

## Services

- **Backend** — Hapi on port 3001

## Getting Started

```bash
./dev.sh
```

`dev.sh` creates `backend/.env` from its `.env.example` on first run, installs dependencies, and launches the API on http://localhost:3001. No docker, no database.

## Environment files

| File | Read by | Contents |
|---|---|---|
| `backend/.env` | API process, e2e runner | Port/host, log level, rate limits |

Created from `backend/.env.example` on first run. There is no root-level `.env` — nothing outside the backend needs configuration.

## Running locally

1. `cd backend && npm install`
2. Copy `.env.example` to `.env` and adjust values if needed.
3. `npm run dev` — loads `backend/.env` automatically; API on **http://localhost:3001**.

All keys are optional and defaulted in `src/config/config.ts`: `PORT`, `HOST`, `LOG_LEVEL`, `BACKEND_URL`, `RATE_LIMIT_DEFAULT_MAX`, `RATE_LIMIT_DEFAULT_WINDOW_MS`.

Production-style run: `npm run build && npm start`. The build copies `src/data` into `dist/data`.

## Backend API

| Method | Path |
|---|---|
| `GET` | `/api/drivers` |
| `GET` | `/api/teams` |
| `GET` | `/api/circuits` |
| `GET` | `/api/races` |
| `GET` | `/api/races/{raceId}` |
| `GET` | `/api/races/{raceId}/weather` |
| `GET` | `/api/races/{raceId}/simulation-parameters` |
| `GET` | `/api/__health/liveness` |
| `GET` | `/api/__health/readiness` |

Interactive Swagger docs are served at `/docs`, and the raw OpenAPI spec at `/docs.json`.

`backend/README.md` documents the response envelope, error codes, the dataset, and the
`X-Debug-Error` header candidates use to reproduce third-party failures.

## Data

Data sets live in `backend/src/data/*.json`: 5 teams, 10 drivers, 7 circuits, 7 races and
5 tyre compounds, all fictional. See `backend/README.md` for the pattern used to expose a
new one (interface → repository contract → file repository → domain → route).

## End-to-end Tests

```bash
cd e2e
npm install
npm run test:agent
```

API-level Playwright tests run against the backend on port 4001. See `docs/e2e-testing.md` for the test stack and conventions.
