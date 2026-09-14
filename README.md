# Technical Challenge — F1 Race Strategist

Welcome, and thanks for taking the time to do this challenge.

Build a small full-stack web application that lets a user prepare and simulate an F1 race strategy.

**Expected effort: 2–4 hours.** Please don't spend significantly more. We would rather see a working, understandable solution than a complete one — leaving things unfinished is fine as long as you tell us what and why.

---

## What you will build

A web application with **a frontend and a backend**, where a user can:

1. Browse and select a race.
2. View relevant race, circuit, tyre, and weather information.
3. Create a tyre strategy for that race.
4. Define pit stops and tyre changes.
5. Run a simulation using the selected strategy.
6. View and understand the simulation result.
7. Compare different strategies.

Your backend must consume the **external F1 API** we provide, and must implement the simulation logic itself.

---

## The external F1 API

We provide a read-only API with drivers, teams, circuits, races, tyres, weather, and race simulation parameters. You run it locally alongside your own application.

```bash
cd backend
npm install
npm run dev          # http://localhost:3001
```

| | |
|---|---|
| **Base URL** | http://localhost:3001 |
| **API documentation (Swagger UI)** | **http://localhost:3001/docs** |
| **OpenAPI spec** | http://localhost:3001/docs.json |

Start with the Swagger UI — it documents every endpoint, response schema, and error.

| Method | Path | Returns |
|---|---|---|
| `GET` | `/api/drivers` | All drivers, each referencing a team |
| `GET` | `/api/teams` | All teams |
| `GET` | `/api/circuits` | All circuits |
| `GET` | `/api/races` | All races, each referencing a circuit |
| `GET` | `/api/races/{raceId}` | One race, with its circuit embedded |
| `GET` | `/api/races/{raceId}/weather` | Weather forecast across the race distance |
| `GET` | `/api/races/{raceId}/simulation-parameters` | Constants for building your simulation |

Health checks, if you need to confirm the API is up:

| Method | Path | Returns |
|---|---|---|
| `GET` | `/api/__health/liveness` | `200` if the API is running |
| `GET` | `/api/__health/readiness` | `200` if the API is running and its data is loadable |

Notes:

- The API has **no simulation endpoint**. It gives you data; the simulation is yours to write.
- Please do not modify it. Treat it as a third-party service you don't control.
- Your backend consumes it. Your frontend should talk to *your* backend, not to this API directly.
- It is read-only and deterministic — the same request always returns the same data.
- `backend/README.md` documents the response format, error codes, and a header you can use to **make the API fail on demand**, so you can exercise your error handling.

---

## The race simulation

This is the core of the challenge.

When the user starts a simulation, your backend should combine the selected strategy with the available race, circuit, tyre, and weather data to estimate how the race would go.

**At minimum, the simulation should:**

- Apply the selected tyre strategy across the race distance.
- Account for tyre performance and degradation.
- Account for pit-stop time loss.
- Take the available weather information into account.
- Calculate an estimated total race time.

**It should return enough detail for the frontend to explain the result**, for example: tyre stints, compounds used, pit stops, laps completed on each tyre, and relevant weather effects.

**The model is entirely up to you.** There is no expected formula and no hidden "correct" answer.

### "How do I know if my result is right?"

You don't, and you're not meant to. There is no reference time to hit.

What matters is that your model is **self-consistent**: because every strategy runs through the *same* model, comparing two strategies is meaningful even though the absolute total time is arbitrary. A user picks a strategy because it is faster *within your simulation*, not because it matches reality.

So the data is there to create genuine trade-offs, and your job is to make them visible:

- Softer tyres are faster but degrade quicker — so how long can you stay out before the pace loss exceeds a pit stop?
- Every extra stop costs `pitStopLoss + tyreChangeTime` — does the fresher rubber pay that back?
- Circuits differ: a stop at Monaco is cheap in time but overtaking is nearly impossible; Bahrain wears tyres far faster.
- If it rains, the wrong compound should cost a lot.

A good submission lets a user run two or three strategies, see that one is (say) 15 seconds quicker, and understand **why** from the breakdown. That is the deliverable — not an accurate lap time.

We are not looking for a scientifically accurate F1 simulator. We want to see how you turn available data into a simulation that is reasonable, understandable, and maintainable.

Document your main assumptions and explain why you chose your approach — this is a significant part of what we evaluate, and a large part of what we'll discuss in the interview.

---

## Minimum requirements

**Frontend** — the user can select a race, view its information, create a strategy, define pit stops and tyre changes, start a simulation, and understand the result.

**Backend** — it should integrate with the external F1 API, expose an API for your frontend, implement the strategy and simulation logic, validate user input, handle errors from the external API, and return useful information to the frontend.

**Error handling** — handle reasonable failure scenarios: invalid strategy, invalid race or tyre selection, external API errors, missing data, unexpected input. How you handle and present these is your call. We're interested in your judgment, not in exhaustive coverage.

---

## Technical freedom

You choose everything: frontend framework, backend technology, language, architecture, testing tools, UI libraries, and any other reasonable tooling.

**A database is optional.** If you use one, pick whatever you like. Just be ready to explain why.

Use what you're productive in. We are not scoring you on stack choice, only on your reasoning.

---

## AI usage

**AI tools are explicitly allowed and encouraged.** Use ChatGPT, Claude, Cursor, GitHub Copilot, or anything else you normally work with — for requirements, research, architecture, coding, debugging, testing, code review, UI, and documentation.

We are not testing how much code you can write from memory. We are interested in how effectively you use modern tools **while still understanding, validating, and taking ownership of the result**. Expect to be asked about any part of what you submit.

---

## Deliverables

A Git repository containing your frontend, backend, tests where appropriate, and a README with setup and run instructions plus any required environment variables.

Your README should briefly cover:

- How to run the application
- High-level architecture
- Important technical decisions
- Your simulation approach and assumptions
- What you would improve with more time

Keep it brief. A page is plenty.

---

## Interview

The challenge is followed by a technical interview of roughly **60 minutes**, focused on your implementation. We may discuss architecture and design decisions, trade-offs, simulation logic, error handling, debugging, testing, your AI usage and how you validated AI-generated code, what you'd change for production, and how you'd handle changes to the requirements.

Be ready to explain the code you submitted and the reasoning behind it.

---

## How we evaluate

- Problem solving and reasoning
- Code quality and maintainability
- Frontend and backend design
- External API integration
- Business logic and simulation design
- Error handling and edge cases
- Technical decision-making
- Autonomy
- Effective use of AI
- Ability to explain and defend your implementation

We are **not** primarily evaluating how much code you produce, or how much F1 you know.

**A simple solution with clear reasoning and good engineering decisions beats a complex one you can't explain.**

---

## Before you submit

- [ ] The app runs from a clean checkout by following your README.
- [ ] A user can select a race, build a strategy, and see a simulation result.
- [ ] Strategies can be compared.
- [ ] Your README covers architecture, decisions, simulation assumptions, and future improvements.
- [ ] You can explain every part of your submission.

Good luck — we're looking forward to seeing what you build.

---

> The provided API is intentionally a simplified F1 data provider for this challenge. Team, driver and circuit **names** are real, but every numeric value (pace, car performance, lap times, tyre degradation, pit-stop loss, weather) is **invented for this exercise**. It does not model real Formula 1 physics or performance, and the figures say nothing about any real team's or driver's ability.
