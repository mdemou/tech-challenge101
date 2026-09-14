import { expect, test } from "@playwright/test";

test.describe("Race-scoped endpoints", () => {
  test("GET /api/races/{raceId} embeds the circuit", async ({ request }) => {
    const response = await request.get("/api/races/race-01");
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.code).toBe("RACE2002");
    expect(body.data.id).toBe("race-01");
    expect(body.data.circuit.id).toBe(body.data.circuitId);
    expect(typeof body.data.circuit.baseLapTime).toBe("number");
  });

  test("GET /api/races/{raceId}/weather covers the full race distance", async ({ request }) => {
    const racesResponse = await request.get("/api/races");
    const { races } = (await racesResponse.json()).data;

    for (const race of races) {
      const response = await request.get(`/api/races/${race.id}/weather`);
      expect(response.status()).toBe(200);

      const { forecast } = (await response.json()).data;
      expect(forecast.length).toBeGreaterThan(0);

      // Segments must start at lap 1, be contiguous, and end on the final lap.
      expect(forecast[0].fromLap).toBe(1);
      expect(forecast[forecast.length - 1].toLap).toBe(race.laps);
      for (let i = 1; i < forecast.length; i++) {
        expect(forecast[i].fromLap).toBe(forecast[i - 1].toLap + 1);
      }

      for (const segment of forecast) {
        expect(segment.rainIntensity).toBeGreaterThanOrEqual(0);
        expect(segment.rainIntensity).toBeLessThanOrEqual(1);
      }
    }
  });

  test("GET /api/races/{raceId}/simulation-parameters returns usable constants", async ({
    request,
  }) => {
    const response = await request.get("/api/races/race-01/simulation-parameters");
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.code).toBe("RACE2004");
    expect(body.data.raceId).toBe("race-01");

    for (const field of [
      "lapTimeVariance",
      "pitStopLoss",
      "tyreChangeTime",
      "fuelEffectPerLap",
      "safetyCarProbability",
      "minimumPitStops",
    ]) {
      expect(typeof body.data[field]).toBe("number");
    }
  });

  test("the weather data set offers both dry and wet races", async ({ request }) => {
    const racesResponse = await request.get("/api/races");
    const { races } = (await racesResponse.json()).data;

    const peakRain: number[] = [];
    for (const race of races) {
      const response = await request.get(`/api/races/${race.id}/weather`);
      const { forecast } = (await response.json()).data;
      peakRain.push(
        Math.max(...forecast.map((segment: { rainIntensity: number }) => segment.rainIntensity)),
      );
    }

    expect(peakRain.some((value) => value === 0)).toBe(true); // a fully dry race
    expect(peakRain.some((value) => value > 0 && value < 0.5)).toBe(true); // light rain
    expect(peakRain.some((value) => value >= 0.7)).toBe(true); // heavy rain
  });

  test.describe("error handling", () => {
    const NOT_FOUND_PATHS = [
      "/api/races/race-99",
      "/api/races/race-99/weather",
      "/api/races/race-99/simulation-parameters",
    ];

    for (const path of NOT_FOUND_PATHS) {
      test(`GET ${path} returns 404 with a stable code`, async ({ request }) => {
        const response = await request.get(path);
        expect(response.status()).toBe(404);

        const body = await response.json();
        expect(body).toMatchObject({ statusCode: 404, code: "RACE4040" });
      });
    }

    test("a malformed race id returns 400", async ({ request }) => {
      const response = await request.get("/api/races/NOT_A_VALID_ID!");
      expect(response.status()).toBe(400);

      const body = await response.json();
      expect(body).toMatchObject({ statusCode: 400, code: "RACE4000" });
    });

    test("an unknown route returns 404", async ({ request }) => {
      const response = await request.get("/api/does-not-exist");
      expect(response.status()).toBe(404);
    });
  });
});
