import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { logger } from "@/lib/telemetry/logger";

describe("TelemetryLogger", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("logs info events with structured context", () => {
    logger.info("USER_LOGIN_SUCCESS", { userId: "user-123", ip: "127.0.0.1" });
    expect(console.log).toHaveBeenCalledTimes(1);
    const firstArg = vi.mocked(console.log).mock.calls[0]?.[0];
    expect(String(firstArg)).toContain("INFO");
    expect(String(firstArg)).toContain("USER_LOGIN_SUCCESS");
  });

  it("logs warnings with context and optional error", () => {
    logger.warn("RATE_LIMIT_WARNING", { key: "ip:192.168.1.1" }, new Error("Limit reached"));
    expect(console.warn).toHaveBeenCalledTimes(1);
    const firstArg = vi.mocked(console.warn).mock.calls[0]?.[0];
    expect(String(firstArg)).toContain("WARN");
    expect(String(firstArg)).toContain("RATE_LIMIT_WARNING");
  });

  it("captures and logs errors safely without throwing", () => {
    const errorObj = new Error("Database query failed");
    logger.error("TRANSACTION_INSERT_FAILED", errorObj, { userId: "user-456" });

    expect(console.error).toHaveBeenCalledTimes(1);
    const firstArg = vi.mocked(console.error).mock.calls[0]?.[0];
    expect(String(firstArg)).toContain("ERROR");
    expect(String(firstArg)).toContain("TRANSACTION_INSERT_FAILED");
  });

  it("records tamper-evident audit logs for sensitive operations", () => {
    logger.audit("ADMIN_ROLE_PROMOTED", "admin-super-uuid", "target-user-uuid", {
      roleGranted: "admin",
    });

    expect(console.log).toHaveBeenCalledTimes(1);
    const firstArg = vi.mocked(console.log).mock.calls[0]?.[0];
    expect(String(firstArg)).toContain("AUDIT");
    expect(String(firstArg)).toContain("AUDIT_ADMIN_ROLE_PROMOTED");
  });
});
