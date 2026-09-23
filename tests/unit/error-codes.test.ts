import { describe, expect, it } from "vitest";
import {
  ERROR_CODES,
  SAFE_ERROR_MESSAGES,
  HTTP_STATUS_MAP,
  AppError,
  type ErrorCode,
} from "@/lib/errors/codes";

describe("Error Taxonomy & Envelope System", () => {
  const allCodes = Object.values(ERROR_CODES) as ErrorCode[];

  it("ensures every ErrorCode has a registered safe human-readable message", () => {
    for (const code of allCodes) {
      const message = SAFE_ERROR_MESSAGES[code];
      expect(message, `Missing safe message for ${code}`).toBeDefined();
      expect(typeof message).toBe("string");
      expect(message.length).toBeGreaterThan(5);
    }
  });

  it("ensures every ErrorCode has an appropriate HTTP status code mapping", () => {
    for (const code of allCodes) {
      const status = HTTP_STATUS_MAP[code];
      expect(status, `Missing HTTP status for ${code}`).toBeDefined();
      expect(status).toBeGreaterThanOrEqual(400);
      expect(status).toBeLessThan(600);
    }
  });

  it("correctly constructs AppError with default localized message and HTTP status", () => {
    const error = new AppError(ERROR_CODES.AUTH_UNAUTHORIZED);
    expect(error.code).toBe(ERROR_CODES.AUTH_UNAUTHORIZED);
    expect(error.httpStatus).toBe(401);
    expect(error.message).toBe(SAFE_ERROR_MESSAGES[ERROR_CODES.AUTH_UNAUTHORIZED]);
    expect(error.name).toBe("AppError");
  });

  it("allows custom error messages overriding default message", () => {
    const custom = "Custom security failure";
    const error = new AppError(ERROR_CODES.AUTH_FORBIDDEN, custom);
    expect(error.message).toBe(custom);
    expect(error.httpStatus).toBe(403);
  });

  it("serializes to a clean ActionErrorEnvelope with field errors", () => {
    const fieldErrors = { amount: ["Amount cannot be negative"] };
    const error = new AppError(ERROR_CODES.VAL_AMOUNT_INVALID, undefined, fieldErrors);
    const envelope = error.toEnvelope();

    expect(envelope.code).toBe(ERROR_CODES.VAL_AMOUNT_INVALID);
    expect(envelope.message).toBe(SAFE_ERROR_MESSAGES[ERROR_CODES.VAL_AMOUNT_INVALID]);
    expect(envelope.fieldErrors).toEqual(fieldErrors);
  });

  it("omits fieldErrors from envelope if none provided", () => {
    const error = new AppError(ERROR_CODES.DB_RECORD_NOT_FOUND);
    const envelope = error.toEnvelope();

    expect(envelope.code).toBe(ERROR_CODES.DB_RECORD_NOT_FOUND);
    expect(envelope.fieldErrors).toBeUndefined();
  });
});
