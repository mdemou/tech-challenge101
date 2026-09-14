import config from '@config/config';
import Boom from '@hapi/boom';
import type { Request, ResponseToolkit } from '@hapi/hapi';

const defaultRateLimit = config.rateLimit.default;

const RATE_LIMIT_ERROR_MESSAGE = 'Too many requests. Please try again later';
const RATE_LIMIT_ERROR_CODE = 'RATE_LIMIT_4290';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

export interface RateLimitPreOptions {
  keyPrefix: string;
  maxAttempts?: number;
  windowMs?: number;
}

const store = new Map<string, RateLimitEntry>();
const runtimeOverrides = new Map<string, { maxAttempts: number; windowMs: number }>();

const rateLimiterService = {
  checkLimit(key: string, maxAttempts: number, windowMs: number): boolean {
    const now = Date.now();
    const entry = store.get(key);

    if (!entry || now > entry.resetAt) {
      store.set(key, { count: 1, resetAt: now + windowMs });
      return true;
    }

    if (entry.count >= maxAttempts) {
      return false;
    }

    entry.count++;
    return true;
  },

  reset(key: string): void {
    store.delete(key);
  },

  resetAll(): void {
    store.clear();
  },

  setRuntimeOverride(keyPrefix: string, override: { maxAttempts: number; windowMs: number } | null): void {
    if (override === null) {
      runtimeOverrides.delete(keyPrefix);
    } else {
      runtimeOverrides.set(keyPrefix, override);
    }
  },

  clearRuntimeOverrides(): void {
    runtimeOverrides.clear();
  },

  createRateLimitPre(options: RateLimitPreOptions) {
    const { keyPrefix } = options;
    const baseMaxAttempts: number = options.maxAttempts ?? defaultRateLimit.maxAttempts;
    const baseWindowMs: number = options.windowMs ?? defaultRateLimit.windowMs;
    const checkLimit = this.checkLimit.bind(this);
    return {
      method: (request: Request, h: ResponseToolkit) => {
        const runtime = runtimeOverrides.get(keyPrefix);
        const maxAttempts = runtime?.maxAttempts ?? baseMaxAttempts;
        const windowMs = runtime?.windowMs ?? baseWindowMs;
        const ip = request.info.remoteAddress;
        const allowed = checkLimit(`${keyPrefix}:${ip}`, maxAttempts, windowMs);
        if (!allowed) {
          throw Boom.tooManyRequests(RATE_LIMIT_ERROR_MESSAGE, {
            code: RATE_LIMIT_ERROR_CODE,
          } as any);
        }
        return h.continue;
      },
    };
  },
};

export default rateLimiterService;
