import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * High-Availability Health Check & Observability Probe
 *
 * Used by Layer 7 Load Balancers (ALB, Nginx, Cloudflare) and Kubernetes/Docker probes:
 * - Liveness probe: returns 200 if the process is up and handling HTTP requests.
 * - Diagnostic telemetry: reports uptime, node environment, process memory utilization, and timestamp.
 */
export async function GET() {
  const startTime = Date.now();
  const memory = process.memoryUsage();

  const healthData = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || "development",
    version: "1.0.0",
    metrics: {
      heapUsedMb: Math.round((memory.heapUsed / 1024 / 1024) * 100) / 100,
      heapTotalMb: Math.round((memory.heapTotal / 1024 / 1024) * 100) / 100,
      rssMb: Math.round((memory.rss / 1024 / 1024) * 100) / 100,
      responseTimeMs: Date.now() - startTime,
    },
  };

  return NextResponse.json(healthData, {
    status: 200,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Content-Type": "application/json",
    },
  });
}
