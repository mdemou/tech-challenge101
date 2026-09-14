import type { APIRequestContext } from '@playwright/test';

export async function setRateLimit(
  request: APIRequestContext,
  keyPrefix: string,
  maxAttempts: number | null,
  windowMs?: number,
): Promise<void> {
  const res = await request.post('/api/__test/rate-limit', {
    data: { keyPrefix, maxAttempts, windowMs },
  });
  if (!res.ok()) {
    throw new Error(`setRateLimit failed (${res.status()}): is E2E_TEST_HOOKS=true set on the backend?`);
  }
}

export async function resetAllRateLimits(request: APIRequestContext): Promise<void> {
  const res = await request.post('/api/__test/rate-limit/reset');
  if (!res.ok()) {
    throw new Error(`resetAllRateLimits failed (${res.status()}): is E2E_TEST_HOOKS=true set on the backend?`);
  }
}
