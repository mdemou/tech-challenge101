# End-to-end tests

Playwright runs API-level tests against the backend on port `4001`. There is no browser and no database — tests use Playwright's `request` fixture, and the API serves hardcoded JSON from `backend/src/data/`.

Install once:

```bash
npm install
```

Scripts:

- `npm run test:agent` is for automated agents. It uses compact output and stops after the first failure.
- `npm test` runs the full suite.
- `npm run test:ui` opens Playwright UI (needs `npm run install:browsers` once — UI mode itself renders in Chromium).
- `npm run test:report` serves the latest HTML report.

Playwright reads `backend/.env` for any backend config it needs to override. See `docs/e2e-testing.md` for architecture, conventions, and examples.
