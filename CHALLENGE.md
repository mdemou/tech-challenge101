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

We provide a read-only API with data such as drivers, teams, circuits, races, tyres, weather, and race simulation parameters.

You run it locally alongside your own application — we'll send you the API and its setup instructions.

| | |
|---|---|
| **Base URL** | `http://localhost:3001` |
| **API documentation** | `http://localhost:3001/docs` (Swagger UI) |
| **OpenAPI spec** | `http://localhost:3001/docs.json` |

Available endpoints:

| Method | Path | Returns |
|---|---|---|
| `GET` | `/api/drivers` | All drivers, each referencing a team |
| `GET` | `/api/teams` | All teams |
| `GET` | `/api/circuits` | All circuits |
| `GET` | `/api/races` | All races, each referencing a circuit |
| `GET` | `/api/races/{raceId}` | One race, with its circuit embedded |
| `GET` | `/api/races/{raceId}/weather` | Weather forecast across the race distance |
| `GET` | `/api/races/{raceId}/simulation-parameters` | Constants for building your simulation |

Notes:

- The API has **no simulation endpoint**. It gives you data; the simulation is yours to write.
- Please do not modify the external API. Treat it as a third-party service you don't control.
- Your backend consumes it. Your frontend should talk to *your* backend, not to the external API directly.
- It is read-only and deterministic — the same request always returns the same data.
- The API's own README documents the response format, error codes, and a header you can use to **make the API fail on demand**, so you can exercise your error handling.

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

**It should return enough detail for the frontend to explain the result**, for example:

- tyre stints
- tyre compounds used
- pit stops
- laps completed on each tyre
- relevant weather effects

**The model is entirely up to you.** There is no expected formula and no hidden "correct" answer.

We are not looking for a scientifically accurate F1 simulator. We want to see how you turn available data into a simulation that is reasonable, understandable, and maintainable.

Document your main assumptions and explain why you chose your approach — this is a significant part of what we evaluate, and it's a large part of what we'll discuss in the interview.

---

## Minimum requirements

**Frontend** — the user can:

- Select a race.
- View relevant race information.
- Create a race strategy.
- Define pit stops and tyre changes.
- Start a simulation.
- View and understand the simulation result.

**Backend** — it should:

- Integrate with the external F1 API.
- Expose an API for your frontend.
- Implement the race strategy and simulation logic.
- Validate user input.
- Handle errors from the external API.
- Return useful information to the frontend.

**Error handling** — handle reasonable failure scenarios, such as:

- Invalid strategy
- Invalid race or tyre selection
- External API errors
- Missing data
- Unexpected input

How you handle and present these is your call. We're interested in your judgment, not in exhaustive coverage.

---

## Technical freedom

You choose everything: frontend framework, backend technology, language, architecture, testing tools, UI libraries, and any other reasonable tooling.

**A database is optional.** If you use one, pick whatever you like — SQL, NoSQL, embedded, or anything else reasonable. Just be ready to explain why.

Use what you're productive in. We are not scoring you on stack choice, only on your reasoning.

---

## AI usage

**AI tools are explicitly allowed and encouraged.** Use ChatGPT, Claude, Cursor, GitHub Copilot, documentation assistants, or anything else you normally work with — for understanding requirements, research, architecture, coding, debugging, testing, code review, UI, and documentation.

We are not testing how much code you can write from memory.

We are interested in how effectively you use modern tools **while still understanding, validating, and taking ownership of the result**. Expect to be asked about any part of what you submit.

---

## Deliverables

A Git repository containing:

- Frontend
- Backend
- README
- Setup and run instructions
- Required environment variables
- Tests where appropriate

Your **README** should briefly cover:

- How to run the application
- High-level architecture
- Important technical decisions
- Your simulation approach and assumptions
- What you would improve with more time

Keep it brief. A page is plenty.

---

## Interview

The challenge is followed by a technical interview focused on your implementation.

We may discuss:

- Architecture and design decisions
- Trade-offs
- Race simulation logic
- Error handling
- Debugging
- Testing
- AI usage, and how you validated AI-generated code
- What you would change for production
- How you'd handle changes to the requirements

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
