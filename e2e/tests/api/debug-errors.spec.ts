import { expect, test } from "@playwright/test";

/**
 * The X-Debug-Error header lets candidates reproduce third-party failures on demand.
 */
test.describe("X-Debug-Error testing hook", () => {
  const SIMULATED = [
    { status: 400, code: "DEBUG4000" },
    { status: 404, code: "DEBUG4040" },
    { status: 429, code: "DEBUG4290" },
    { status: 500, code: "DEBUG5000" },
    { status: 503, code: "DEBUG5030" },
  ];

  for (const { status, code } of SIMULATED) {
    test(`X-Debug-Error: ${status} makes a data endpoint fail with ${status}`, async ({
      request,
    }) => {
      const response = await request.get("/api/races", {
        headers: { "X-Debug-Error": String(status) },
      });
      expect(response.status()).toBe(status);

      const body = await response.json();
      expect(body).toMatchObject({ statusCode: status, code });
    });
  }

  test("the header applies to every data endpoint", async ({ request }) => {
    for (const path of ["/api/drivers", "/api/teams", "/api/circuits", "/api/tyres"]) {
      const response = await request.get(path, { headers: { "X-Debug-Error": "429" } });
      expect(response.status()).toBe(429);
    }
  });

  test("an unsupported value returns 400 rather than being ignored", async ({ request }) => {
    const response = await request.get("/api/races", {
      headers: { "X-Debug-Error": "418" },
    });
    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body).toMatchObject({ statusCode: 400, code: "DEBUG4001" });
  });

  test("health endpoints are not affected by the header", async ({ request }) => {
    const response = await request.get("/api/__health/liveness", {
      headers: { "X-Debug-Error": "500" },
    });
    expect(response.status()).toBe(200);
  });

  test("without the header the API responds normally", async ({ request }) => {
    const response = await request.get("/api/races");
    expect(response.status()).toBe(200);
  });
});
