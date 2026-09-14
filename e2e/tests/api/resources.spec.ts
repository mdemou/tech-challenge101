import { expect, test } from "@playwright/test";

/**
 * Every list resource returns 200, the standard response envelope, and a non-empty
 * collection under the expected data key.
 */
const LIST_RESOURCES = [
  { path: "/api/drivers", key: "drivers", code: "DRV2001", minimum: 10 },
  { path: "/api/teams", key: "teams", code: "TEAM2001", minimum: 5 },
  { path: "/api/circuits", key: "circuits", code: "CIR2001", minimum: 6 },
  { path: "/api/tyres", key: "tyres", code: "TYR2001", minimum: 5 },
  { path: "/api/races", key: "races", code: "RACE2001", minimum: 6 },
];

test.describe("Resource collections", () => {
  for (const resource of LIST_RESOURCES) {
    test(`GET ${resource.path} returns the expected collection`, async ({ request }) => {
      const response = await request.get(resource.path);
      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.statusCode).toBe(200);
      expect(body.code).toBe(resource.code);
      expect(typeof body.message).toBe("string");

      const collection = body.data[resource.key];
      expect(Array.isArray(collection)).toBe(true);
      expect(collection.length).toBeGreaterThanOrEqual(resource.minimum);
    });
  }

  test("tyre compounds cover every required compound with coherent trade-offs", async ({
    request,
  }) => {
    const response = await request.get("/api/tyres");
    const { tyres } = (await response.json()).data;

    const byCompound = Object.fromEntries(
      tyres.map((tyre: { compound: string }) => [tyre.compound, tyre]),
    );
    expect(Object.keys(byCompound).sort()).toEqual(
      ["HARD", "INTERMEDIATE", "MEDIUM", "SOFT", "WET"].sort(),
    );

    // Softer compounds are faster but degrade more.
    expect(byCompound.SOFT.pace).toBeLessThan(byCompound.MEDIUM.pace);
    expect(byCompound.MEDIUM.pace).toBeLessThan(byCompound.HARD.pace);
    expect(byCompound.SOFT.degradation).toBeGreaterThan(byCompound.MEDIUM.degradation);
    expect(byCompound.MEDIUM.degradation).toBeGreaterThan(byCompound.HARD.degradation);

    // Wet-weather compounds trade dry pace for wet grip.
    expect(byCompound.INTERMEDIATE.wetPerformance).toBeGreaterThan(byCompound.HARD.wetPerformance);
    expect(byCompound.WET.wetPerformance).toBeGreaterThan(byCompound.INTERMEDIATE.wetPerformance);
    expect(byCompound.WET.pace).toBeGreaterThan(byCompound.INTERMEDIATE.pace);

    // WET is designed for heavier rain than INTERMEDIATE.
    expect(byCompound.WET.optimalRainIntensity.max).toBeGreaterThan(
      byCompound.INTERMEDIATE.optimalRainIntensity.max,
    );
  });

  test("circuits have meaningfully different characteristics", async ({ request }) => {
    const response = await request.get("/api/circuits");
    const { circuits } = (await response.json()).data;

    const distinct = (field: string) =>
      new Set(circuits.map((circuit: Record<string, unknown>) => circuit[field])).size;

    expect(distinct("laps")).toBeGreaterThan(3);
    expect(distinct("baseLapTime")).toBe(circuits.length);
    expect(distinct("pitStopLoss")).toBeGreaterThan(3);
    expect(distinct("tyreWear")).toBeGreaterThan(3);
    expect(distinct("overtakingDifficulty")).toBeGreaterThan(3);
  });
});
