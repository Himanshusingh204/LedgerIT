import { describe, expect, it } from "vitest";
import { rateLimiter } from "@/lib/security/limiter";

describe("SlidingWindowLimiter", () => {
  it("allows requests up to the configured limit", () => {
    const key = `test-user-${Date.now()}-1`;
    const limit = 5;

    for (let i = 1; i <= limit; i++) {
      const res = rateLimiter.check(key, limit, 60_000);
      expect(res.success).toBe(true);
      expect(res.remaining).toBe(limit - i);
    }
  });

  it("blocks requests once limit is exceeded", () => {
    const key = `test-user-${Date.now()}-2`;
    const limit = 3;

    // Consume limit
    for (let i = 0; i < limit; i++) {
      rateLimiter.check(key, limit, 60_000);
    }

    // 4th request must be rejected
    const blockedRes = rateLimiter.check(key, limit, 60_000);
    expect(blockedRes.success).toBe(false);
    expect(blockedRes.remaining).toBe(0);
    expect(blockedRes.resetInMs).toBeGreaterThan(0);
  });

  it("isolates counters between different client keys", () => {
    const keyA = `client-A-${Date.now()}`;
    const keyB = `client-B-${Date.now()}`;
    const limit = 2;

    rateLimiter.check(keyA, limit, 60_000);
    rateLimiter.check(keyA, limit, 60_000);
    expect(rateLimiter.check(keyA, limit, 60_000).success).toBe(false);

    // keyB is fresh and untouched
    const resB = rateLimiter.check(keyB, limit, 60_000);
    expect(resB.success).toBe(true);
    expect(resB.remaining).toBe(1);
  });

  it("resets limits when explicitly commanded", () => {
    const key = `reset-user-${Date.now()}`;
    const limit = 1;

    rateLimiter.check(key, limit, 60_000);
    expect(rateLimiter.check(key, limit, 60_000).success).toBe(false);

    rateLimiter.reset(key);

    const freshRes = rateLimiter.check(key, limit, 60_000);
    expect(freshRes.success).toBe(true);
    expect(freshRes.remaining).toBe(0);
  });

  it("reports tracking statistics and garbage collection state", () => {
    const stats = rateLimiter.getStats();
    expect(stats).toHaveProperty("trackedKeysCount");
    expect(stats).toHaveProperty("lastCleanup");
    expect(typeof stats.trackedKeysCount).toBe("number");
  });
});
