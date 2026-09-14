import { expect, test } from "@playwright/test";

test.describe("Smoke: infrastructure connectivity", () => {
  test("backend liveness check returns 200", async ({ request }) => {
    const response = await request.get("/api/__health/liveness");
    expect(response.status()).toBe(200);
  });

  test("backend readiness check returns 200", async ({ request }) => {
    const response = await request.get("/api/__health/readiness");
    expect(response.status()).toBe(200);
  });

  test("swagger documentation is served", async ({ request }) => {
    const response = await request.get("/docs.json");
    expect(response.status()).toBe(200);

    const spec = await response.json();
    expect(Object.keys(spec.paths)).toEqual(
      expect.arrayContaining([
        "/api/drivers",
        "/api/teams",
        "/api/circuits",
        "/api/tyres",
        "/api/races",
        "/api/races/{raceId}",
        "/api/races/{raceId}/weather",
        "/api/races/{raceId}/simulation-parameters",
      ]),
    );
  });

  test("the API exposes no simulation endpoint", async ({ request }) => {
    const response = await request.get("/docs.json");
    const spec = await response.json();

    const simulationPaths = Object.keys(spec.paths).filter(
      (path) => path.includes("simulate") || path.endsWith("/simulation"),
    );
    expect(simulationPaths).toEqual([]);
  });
});
