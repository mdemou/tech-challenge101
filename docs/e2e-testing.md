# E2E Testing

End-to-end tests use [Playwright](https://playwright.dev/) and live in the `e2e/` directory at the project root. This is a backend-only project, so tests are API-level: they drive the HTTP API with Playwright's `request` fixture and assert on the responses. No browser and no database are involved.

## Agents and automation

Automated agents should always run the suite through the agent script:

```bash
cd e2e
npm run test:agent
```

`npm run test:agent` enables `E2E_AGENT=1`, uses a compact reporter, stops after the first failure, and suppresses dev-server logs. Humans can use `npm test` and `npm run test:ui` when debugging locally.

## Architecture

Tests run against dedicated infrastructure so they do not touch local development state.

```text
Playwright `request` fixture
  -> Backend dev server (localhost:4001)
      -> Hardcoded JSON in backend/src/data/
```

The test backend uses port `4001`, leaving the normal development port `3001` free.

Because the API is stateless and serves read-only JSON, there is no test database to
provision or tear down and no cross-test data contamination to guard against.

## Prerequisites

- `backend/` dependencies must be installed.
- `backend/.env` must exist. Copy `backend/.env.example` if needed.

## Setup

```bash
cd e2e
npm install
```

Playwright browsers are only needed for `npm run test:ui`; install them with `npm run install:browsers`.

## Running Tests

```bash
cd e2e

# Agents / automation
npm run test:agent

# Local human runs
npm test
npm run test:ui
```

## What Happens On Each Run

Playwright starts the backend on `localhost:4001` with `E2E_TEST_HOOKS=true` and relaxed rate-limit env vars. `baseURL` points at that server, so tests can use relative paths like `/api/__health/liveness`. There is no setup or teardown step — the API reads the same committed JSON files on every run.

## Smoke Tests

`e2e/tests/smoke.spec.ts` verifies the basic request chain:

- Backend liveness works.
- Backend readiness can parse every JSON data file.
- Swagger documentation is served and lists every data endpoint.
- No simulation endpoint is exposed.

`e2e/tests/api/` covers the data API itself:

| File | Covers |
|---|---|
| `resources.spec.ts` | Every collection returns 200 and a sane payload; tyre trade-offs and circuit variety hold. |
| `races.spec.ts` | Race details, weather and simulation parameters; `404` and `400` paths. |
| `debug-errors.spec.ts` | The `X-Debug-Error` header, including `429` and `500`. |
| `data-consistency.spec.ts` | Referential integrity and determinism across the data set. |

## Adding Tests

Place tests under `e2e/tests/`, grouped by feature folder. Requirement-backed tests should use this naming style:

```text
e2e/tests/<feature>/
  req-<feature-code>-001.spec.ts
  req-<feature-code>-002.spec.ts
```

Each test file should start with a JSDoc block naming the requirement and user story, then group tests by acceptance criteria:

```typescript
import { expect, test } from "@playwright/test";

/**
 * REQ-EXAMPLE-001: Example behavior
 *
 * "As an API consumer, I can understand the e2e test shape."
 */

test.describe("REQ-EXAMPLE-001: Example behavior", () => {
  test.describe("AC-EXAMPLE-001.1: Acceptance criterion", () => {
    test("does the expected thing", async ({ request }) => {
      const response = await request.get("/api/__health/liveness");
      expect(response.status()).toBe(200);
    });
  });
});
```

See `e2e/tests/example/` for skipped placeholder tests that document the structure without adding product-specific behavior. Remove that example once the first e2e test is implemented. Remove this line from this file too.

## Fixtures

The data the API serves is committed at `backend/src/data/*.json`. Tests assert against
those files directly — read the JSON to derive expectations rather than hardcoding values
in the spec, so adding a record does not break unrelated tests.
