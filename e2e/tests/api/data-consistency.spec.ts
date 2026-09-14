import { expect, test } from "@playwright/test";

/**
 * Referential integrity across the data set. A candidate should never hit a dangling
 * reference or a race that is missing weather or simulation parameters.
 */
test.describe("Data consistency", () => {
  test("every driver references an existing team", async ({ request }) => {
    const [driversResponse, teamsResponse] = await Promise.all([
      request.get("/api/drivers"),
      request.get("/api/teams"),
    ]);

    const { drivers } = (await driversResponse.json()).data;
    const { teams } = (await teamsResponse.json()).data;
    const teamIds = new Set(teams.map((team: { id: string }) => team.id));

    for (const driver of drivers) {
      expect(teamIds).toContain(driver.teamId);
    }
  });

  test("driver numbers and ids are unique", async ({ request }) => {
    const response = await request.get("/api/drivers");
    const { drivers } = (await response.json()).data;

    expect(new Set(drivers.map((d: { id: string }) => d.id)).size).toBe(drivers.length);
    expect(new Set(drivers.map((d: { number: number }) => d.number)).size).toBe(drivers.length);
  });

  test("every race references an existing circuit and agrees on lap count", async ({ request }) => {
    const [racesResponse, circuitsResponse] = await Promise.all([
      request.get("/api/races"),
      request.get("/api/circuits"),
    ]);

    const { races } = (await racesResponse.json()).data;
    const { circuits } = (await circuitsResponse.json()).data;
    const circuitsById = new Map(
      circuits.map((circuit: { id: string }) => [circuit.id, circuit]),
    );

    for (const race of races) {
      const circuit = circuitsById.get(race.circuitId) as { laps: number } | undefined;
      expect(circuit).toBeDefined();
      expect(race.laps).toBe(circuit!.laps);
    }
  });

  test("every race has weather and simulation parameters", async ({ request }) => {
    const racesResponse = await request.get("/api/races");
    const { races } = (await racesResponse.json()).data;

    for (const race of races) {
      const [weather, parameters] = await Promise.all([
        request.get(`/api/races/${race.id}/weather`),
        request.get(`/api/races/${race.id}/simulation-parameters`),
      ]);

      expect(weather.status()).toBe(200);
      expect(parameters.status()).toBe(200);
      expect((await weather.json()).data.raceId).toBe(race.id);
      expect((await parameters.json()).data.raceId).toBe(race.id);
    }
  });

  test("simulation pitStopLoss matches the circuit it belongs to", async ({ request }) => {
    const racesResponse = await request.get("/api/races");
    const { races } = (await racesResponse.json()).data;

    for (const race of races) {
      const [detailsResponse, parametersResponse] = await Promise.all([
        request.get(`/api/races/${race.id}`),
        request.get(`/api/races/${race.id}/simulation-parameters`),
      ]);

      const details = (await detailsResponse.json()).data;
      const parameters = (await parametersResponse.json()).data;
      expect(parameters.pitStopLoss).toBe(details.circuit.pitStopLoss);
    }
  });

  test("responses are deterministic across repeated requests", async ({ request }) => {
    const first = await (await request.get("/api/races/race-03")).json();
    const second = await (await request.get("/api/races/race-03")).json();
    expect(first).toEqual(second);
  });
});
