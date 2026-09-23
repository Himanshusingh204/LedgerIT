/**
 * In-Memory Sliding Window Rate Limiter
 *
 * Designed for edge/serverless or single/multi-container deployments to defend against
 * brute force and rapid spam attacks on critical endpoints (feedback, sign-up, mutations).
 *
 * Includes automatic garbage collection to purge expired window entries and prevent memory leaks.
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

class SlidingWindowLimiter {
  private cache = new Map<string, RateLimitRecord>();
  private lastCleanup = Date.now();
  private readonly cleanupIntervalMs = 60_000; // 1 minute

  /**
   * Check if an identifier (IP address, user ID, or composite key) is within limits.
   *
   * @param key Unique client identifier (e.g. `ip:192.168.1.1` or `user:uuid`)
   * @param limit Maximum allowed requests in the given window
   * @param windowMs Time window in milliseconds (default: 60,000ms = 1 minute)
   * @returns { success: boolean, remaining: number, resetInMs: number }
   */
  check(key: string, limit: number, windowMs = 60_000): { success: boolean; remaining: number; resetInMs: number } {
    const now = Date.now();

    // Trigger garbage collection periodically
    if (now - this.lastCleanup > this.cleanupIntervalMs) {
      this.cleanup(now);
    }

    const record = this.cache.get(key);

    if (!record || now >= record.resetAt) {
      // New or expired window
      this.cache.set(key, { count: 1, resetAt: now + windowMs });
      return { success: true, remaining: limit - 1, resetInMs: windowMs };
    }

    if (record.count >= limit) {
      // Limit exceeded
      return {
        success: false,
        remaining: 0,
        resetInMs: Math.max(0, record.resetAt - now),
      };
    }

    // Increment within active window
    record.count += 1;
    return {
      success: true,
      remaining: limit - record.count,
      resetInMs: Math.max(0, record.resetAt - now),
    };
  }

  /**
   * Garbage collection: remove expired records to prevent unbounded memory growth.
   */
  private cleanup(now: number) {
    this.lastCleanup = now;
    for (const [key, record] of this.cache.entries()) {
      if (now >= record.resetAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Reset the rate limit for a specific key (e.g. after successful CAPTCHA or testing)
   */
  reset(key: string) {
    this.cache.delete(key);
  }

  /**
   * Return current memory footprint stats
   */
  getStats() {
    return {
      trackedKeysCount: this.cache.size,
      lastCleanup: new Date(this.lastCleanup).toISOString(),
    };
  }
}

export const rateLimiter = new SlidingWindowLimiter();
