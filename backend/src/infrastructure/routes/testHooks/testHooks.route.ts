import type { Request, ResponseToolkit, ServerRoute } from '@hapi/hapi';
import rateLimiterService from '@services/rateLimiter.service';
import Joi from 'joi';

interface SetRateLimitPayload {
  keyPrefix: string;
  maxAttempts: number | null;
  windowMs?: number;
}

export const testHooksSetRateLimitRoute: ServerRoute = {
  method: 'POST',
  path: '/api/__test/rate-limit',
  options: {
    description: 'Test hook: set or clear a runtime rate-limit override for a keyPrefix',
    handler: (request: Request, h: ResponseToolkit) => {
      const { keyPrefix, maxAttempts, windowMs } = request.payload as SetRateLimitPayload;
      if (maxAttempts === null) {
        rateLimiterService.setRuntimeOverride(keyPrefix, null);
      } else {
        rateLimiterService.setRuntimeOverride(keyPrefix, {
          maxAttempts,
          windowMs: windowMs ?? 3_600_000,
        });
      }
      rateLimiterService.reset(`${keyPrefix}:127.0.0.1`);
      rateLimiterService.reset(`${keyPrefix}:::1`);
      return h.response({ ok: true }).code(200);
    },
    validate: {
      payload: Joi.object({
        keyPrefix: Joi.string().required(),
        maxAttempts: Joi.number().integer().min(1).allow(null).required(),
        windowMs: Joi.number().integer().min(1).optional(),
      }),
    },
    tags: ['api', 'test-hooks'],
  },
};

export const testHooksResetRateLimitsRoute: ServerRoute = {
  method: 'POST',
  path: '/api/__test/rate-limit/reset',
  options: {
    description: 'Test hook: clear all runtime overrides and in-memory rate-limit counters',
    handler: (_request: Request, h: ResponseToolkit) => {
      rateLimiterService.clearRuntimeOverrides();
      rateLimiterService.resetAll();
      return h.response({ ok: true }).code(200);
    },
    tags: ['api', 'test-hooks'],
  },
};
