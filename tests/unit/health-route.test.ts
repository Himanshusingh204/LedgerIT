import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/health/route";

describe("Health Check API Route (/api/health)", () => {
  it("returns HTTP 200 OK with healthy status payload", async () => {
    const response = await GET();
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.status).toBe("healthy");
    expect(body).toHaveProperty("timestamp");
    expect(typeof body.uptimeSeconds).toBe("number");
    expect(body.metrics).toBeDefined();
    expect(body.metrics.heapUsedMb).toBeGreaterThan(0);
    expect(body.metrics.rssMb).toBeGreaterThan(0);
    expect(typeof body.metrics.responseTimeMs).toBe("number");
  });

  it("sets strict no-cache headers to prevent proxy caching", async () => {
    const response = await GET();
    const cacheControl = response.headers.get("Cache-Control");
    expect(cacheControl).toContain("no-store");
    expect(cacheControl).toContain("no-cache");
  });
});
