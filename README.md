# Technical Challenge — F1 Race Strategist

Welcome, and thanks for taking the time to do this challenge.

Build a small full-stack web application that lets a user put together an F1 race strategy and see how it turns out.

**Expected effort: 1–2 hours.** Please don't spend significantly more. We would much rather see something small and working than something ambitious and half-finished. Leaving things out is fine — just tell us what and why.

---

## What you will build

A web application with **a frontend and a backend**, where a user can:

1. Pick a race.
2. See the relevant race, circuit and tyre information.
3. Build a tyre strategy — which compounds, and when to pit.
4. Run a simulation.
5. See and understand the result.

Your backend consumes the **external F1 API** we provide, and runs the simulation itself.

---

## The external F1 API

A read-only API with drivers, teams, circuits, races, tyres, weather and simulation parameters. You run it locally alongside your own application.

```bash
cd backend
npm install
npm run dev          # http://localhost:3001
```

|                                    |                                 |
| ---------------------------------- | ------------------------------- |
| **Base URL**                       | http://localhost:3001           |
| **API documentation (Swagger UI)** | **http://localhost:3001/docs**  |
| **OpenAPI spec**                   | http://localhost:3001/docs.json |

Start with the Swagger UI — it documents every endpoint, response schema, and error.

| Method | Path                                        | Returns                                   |
| ------ | ------------------------------------------- | ----------------------------------------- |
| `GET`  | `/api/drivers`                              | All drivers, each referencing a team      |
| `GET`  | `/api/teams`                                | All teams                                 |
| `GET`  | `/api/circuits`                             | All circuits                              |
| `GET`  | `/api/races`                                | All races, each referencing a circuit     |
| `GET`  | `/api/races/{raceId}`                       | One race, with its circuit embedded       |
| `GET`  | `/api/races/{raceId}/weather`               | Weather forecast across the race distance |
| `GET`  | `/api/races/{raceId}/simulation-parameters` | Constants you may use in your simulation  |

Health checks, if you need to confirm the API is up:

| Method | Path                      | Returns                                              |
| ------ | ------------------------- | ---------------------------------------------------- |
| `GET`  | `/api/__health/liveness`  | `200` if the API is running                          |
| `GET`  | `/api/__health/readiness` | `200` if the API is running and its data is loadable |

Notes:

- The API has **no simulation endpoint**. It gives you data; the simulation is yours to write.
- It is read-only and deterministic — the same request always returns the same data.
- `backend/README.md` documents the response format, error codes, and a header you can use to **make the API fail on demand**, so you can exercise your error handling.

---

## The race simulation

> **We do not evaluate your simulation model.**
>
> There is no expected formula, no reference lap time, and no hidden "correct" answer. Two candidates with completely different models are both right. Pick something simple, make a decision, and move on.

What we actually care about is **what ends up on the screen** — how you turn a result into something a user can read and understand.

A minimal model is genuinely fine. For example: walk the race lap by lap, add the tyre's pace and how worn it is, add the pit-stop loss for each stop, and total it up. That's enough.

The simulation should at least:

- Apply the chosen tyre stints across the race distance.
- Account for tyre degradation.
- Account for pit-stop time loss.
- Produce an estimated total race time **plus a breakdown**: stints, compounds, laps per stint, pit stops.

The breakdown matters more than the total, because that's what the user actually reads.

**Optional, only if you have time:** weather, driver or car performance. Ignoring them is a perfectly good answer — just say so.

Write down your main assumptions. A few lines is plenty.

---

## Minimum requirements

**Frontend** — the user can pick a race, see its information, build a strategy, run the simulation, and understand the result on screen.

**Backend** — fetch data from the F1 API, expose an endpoint for your frontend, run the simulation, validate the submitted strategy, and handle errors from the F1 API.

**Error handling** — cover the obvious cases: an invalid strategy, and the F1 API failing or returning nothing. How you surface these to the user is your call.

**Nice to have, not required** — comparing two strategies side by side, weather effects, driver or car performance, persistence, polish.

---

## Technical freedom

You choose everything: frontend framework, backend technology, language, architecture, testing tools, UI libraries.

**A database is optional.** for this. If you add one anyway, be ready to explain why.

Use what you're fastest in. We are not scoring your stack, only your reasoning.

---

## AI usage

**AI tools are explicitly allowed and encouraged.** Use ChatGPT, Claude, Cursor, GitHub Copilot, or anything else you normally work with.

We are not testing how much code you can write from memory. We are interested in how effectively you use modern tools **while still understanding and owning the result**.

---

## Deliverables

A Git repository with your frontend, backend, and a short README covering:

- How to run it
- Your simulation assumptions
- What you'd improve with more time

Keep it brief — half a page is plenty. Add tests if you think they're worth the time.

---

## Interview

The challenge is followed by a technical interview of roughly **45-60 minutes**, focused on your implementation.

Be ready to explain the code you submitted and the reasoning behind it.

---

## How we evaluate

In rough order of weight:

1. **How you present the result** — can a user understand what happened and why?
2. **Code quality and maintainability**
3. **Frontend and backend design**
4. **External API integration and error handling**
5. **Technical decision-making and trade-offs**
6. **Effective use of AI, and ownership of what it produced**
7. **Ability to explain and defend your implementation**

We are **not** evaluating the accuracy of your simulation, how much code you produce, or how much F1 you know.

**A simple solution with clear reasoning beats a complex one you can't explain.**

---

## Before you submit

- [ ] It runs from a clean checkout by following your README.
- [ ] A user can pick a race, build a strategy, and see a result they can understand.
- [ ] Your README covers how to run it, your decisions, and your assumptions.

Good luck — we're looking forward to seeing what you build.

---

> The provided API is intentionally a simplified F1 data provider for this challenge. Team, driver and circuit **names** are real, but every numeric value (pace, car performance, lap times, tyre degradation, pit-stop loss, weather) is **invented for this exercise**. It does not model real Formula 1 physics or performance, and the figures say nothing about any real team's or driver's ability.
