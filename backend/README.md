# F1 Simulator API

A small, read-only REST API that serves simplified Formula 1 data. It is the **external data provider** for the *F1 Race Strategist* take-home challenge.

> This API is intentionally a simplified F1 data provider for a coding challenge. Team, driver and circuit **names** are real, but every numeric attribute (pace, consistency, car performance, lap times, degradation, pit-stop loss, weather) is **invented for this exercise**. It is not intended to model real Formula 1 physics or performance, and the values do not reflect any real team's or driver's ability.

It gives candidates drivers, teams, circuits, races, tyres, weather and simulation parameters. **It deliberately does not simulate anything** — building the strategy and simulation logic is the candidate's job.

## Install

```bash
cd backend
npm install
```

## Run

```bash
cp .env.example .env   # optional, everything is defaulted
npm run dev            # http://localhost:3001
```

Production-style run:

```bash
npm run build && npm start
```

There is no database. All data is read from JSON files in `src/data/`; the build copies them into `dist/data/`.

## Tests

The test suite lives in `e2e/` at the repository root and runs against a real server instance:

```bash
cd e2e
npm install
npm run test:agent
```

## API documentation

| | |
|---|---|
| Swagger UI | http://localhost:3001/docs |
| OpenAPI spec | http://localhost:3001/docs.json |

## Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/drivers` | All drivers. Each references a team via `teamId`. |
| `GET` | `/api/teams` | All teams, with relative car performance. |
| `GET` | `/api/circuits` | All circuits, with lap count, base lap time, pit-stop loss, tyre wear and overtaking difficulty. |
| `GET` | `/api/races` | All races. Each references a circuit via `circuitId`. |
| `GET` | `/api/races/{raceId}` | A single race with its circuit embedded. |
| `GET` | `/api/races/{raceId}/weather` | Weather forecast broken into lap ranges covering the full race. |
| `GET` | `/api/races/{raceId}/simulation-parameters` | Constants for building a simulation model. |
| `GET` | `/api/__health/liveness` | Liveness probe. |
| `GET` | `/api/__health/readiness` | Readiness probe — parses every data file. |

### Response format

Every response uses the same envelope. Successful responses carry a `data` object:

```json
{
  "statusCode": 200,
  "code": "RACE2001",
  "message": "Races retrieved",
  "data": { "races": [] }
}
```

Errors use the same shape without `data`. The `code` is stable and machine-readable:

```json
{
  "statusCode": 404,
  "code": "RACE4040",
  "message": "Race not found"
}
```

| Status | When |
|---|---|
| `200` | Success |
| `400` | Malformed request, e.g. an invalid `raceId` format |
| `404` | Unknown resource or unknown route |
| `500` | Unexpected server error |

## Environment variables

All optional — every value is defaulted in `src/config/config.ts`.

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `3001` | HTTP port |
| `HOST` | `0.0.0.0` | Bind address |
| `LOG_LEVEL` | `info` | Pino log level |
| `BACKEND_URL` | `http://localhost:3001` | Self-reference for docs |
| `RATE_LIMIT_DEFAULT_MAX` | `100` | Default rate-limit budget |
| `RATE_LIMIT_DEFAULT_WINDOW_MS` | `3600000` | Default rate-limit window |

## Debug: simulating third-party failures

Candidates are expected to handle a flaky external API. Send the `X-Debug-Error` header with a status code and the API will fail with that status instead of returning data:

```bash
curl -H "X-Debug-Error: 429" http://localhost:3001/api/races
```

```json
{
  "statusCode": 429,
  "code": "DEBUG4290",
  "message": "Simulated rate limit. Too many requests"
}
```

Supported values: `400`, `404`, `429`, `500`, `503`. Any other value returns `400` with code `DEBUG4001`.

Notes:

- Only applies to `/api/*` data endpoints. Health endpoints ignore it, so a globally-set header cannot make the service look down.
- It is not part of the Swagger documentation — it is a testing aid, not a feature of the data API.
- Without the header the API is fully deterministic: the same request always returns the same data.

## Data

| Resource | Count |
|---|---|
| Teams | 10 |
| Drivers | 20 |
| Circuits | 7 |
| Races | 7 |
| Tyre compounds | 5 |

The data set is designed to create real trade-offs:

- **Circuits** differ in lap count, lap time, pit-stop loss, tyre wear and overtaking difficulty.
- **Tyres** trade pace against durability; `INTERMEDIATE` and `WET` trade dry pace for wet grip, and `optimalRainIntensity` says which rain band each compound is built for.
- **Weather** spans a fully dry race, persistent light rain, rain arriving mid-race, a drying track, and a heavy-rain race.

Names are drawn from the real 2025 grid and calendar so the data feels familiar. All performance figures are fabricated.

## Architecture

Layered, following `docs/backend-layering.md`:

```
src/
  data/                          # the JSON data set
  domain/                        # business logic, framework-free
    _interfaces/                 # data types
    _repositories/               # repository contracts
    races/ drivers/ teams/ circuits/ tyres/ health/
  infrastructure/                # everything touching the outside world
    extensions/debugError.ts     # X-Debug-Error hook
    repositories/*File/          # JSON-file repository implementations
    routes/<resource>/           # route + controller + doc + responses
  services/                      # logger, file loading, responses, rate limiting
```

See `docs/backend-layering.md` and `docs/api-documentation.md` for the conventions to follow when adding a resource.

## Adding a resource

1. Drop a `.json` file in `src/data/`.
2. Define its type in `domain/_interfaces/`.
3. Declare a repository contract in `domain/_repositories/`.
4. Implement it in `infrastructure/repositories/<name>File/`.
5. Add the domain factory in `domain/<name>/`.
6. Add `route` / `controller` / `doc` / `responses` in `infrastructure/routes/<name>/`.
7. Register the route in `infrastructure/routes/routes.ts`.
