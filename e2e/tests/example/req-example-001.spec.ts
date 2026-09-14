import { expect, test } from '@playwright/test';

/**
 * REQ-EXAMPLE-001: Placeholder requirement
 *
 * "As a product team, we can use this file as a template for requirement-level e2e tests."
 */

test.describe.skip('REQ-EXAMPLE-001: Placeholder requirement', () => {
  test.describe('AC-EXAMPLE-001.1: API request shape', () => {
    test('exercises an endpoint and asserts the response envelope', async ({ request }) => {
      const response = await request.get('/api/races');
      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body).toMatchObject({ statusCode: 200, code: 'RACE2001' });
    });
  });

  test.describe('AC-EXAMPLE-001.2: Hardcoded data assertion shape', () => {
    test('asserts against the JSON fixture the API serves', async ({ request }) => {
      const response = await request.get('/api/races/race-01');
      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.data).toHaveProperty('id', 'race-01');
      expect(body.data.circuit).toHaveProperty('baseLapTime');
    });
  });
});
