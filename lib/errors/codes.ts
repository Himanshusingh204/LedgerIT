/**
 * Centralized Error Code Catalog & Safe Error Messages
 *
 * Invariants:
 * 1. Every application error maps to a discrete, domain-specific ErrorCode.
 * 2. Raw database error strings or internal stack traces are NEVER returned to the client.
 * 3. User-facing messages are safe, localized, and actionable.
 */

export const ERROR_CODES = {
  // Authentication & Authorization
  AUTH_UNAUTHORIZED: "AUTH_UNAUTHORIZED",
  AUTH_SESSION_EXPIRED: "AUTH_SESSION_EXPIRED",
  AUTH_FORBIDDEN: "AUTH_FORBIDDEN",
  AUTH_INSUFFICIENT_PERMISSIONS: "AUTH_INSUFFICIENT_PERMISSIONS",

  // Input & Schema Validation
  VAL_INVALID_INPUT: "VAL_INVALID_INPUT",
  VAL_AMOUNT_INVALID: "VAL_AMOUNT_INVALID",
  VAL_DATE_OUT_OF_RANGE: "VAL_DATE_OUT_OF_RANGE",
  VAL_REQUIRED_FIELD_MISSING: "VAL_REQUIRED_FIELD_MISSING",

  // Data & Storage
  DB_RECORD_NOT_FOUND: "DB_RECORD_NOT_FOUND",
  DB_RECORD_ALREADY_EXISTS: "DB_RECORD_ALREADY_EXISTS",
  DB_QUERY_FAILED: "DB_QUERY_FAILED",
  DB_CONNECTION_FAILED: "DB_CONNECTION_FAILED",

  // Network & Abuse Prevention
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
  PAYLOAD_TOO_LARGE: "PAYLOAD_TOO_LARGE",

  // System & Fallbacks
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export const SAFE_ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ERROR_CODES.AUTH_UNAUTHORIZED]: "You must be signed in to perform this action.",
  [ERROR_CODES.AUTH_SESSION_EXPIRED]: "Your session has expired. Please sign in again.",
  [ERROR_CODES.AUTH_FORBIDDEN]: "You do not have permission to access this resource.",
  [ERROR_CODES.AUTH_INSUFFICIENT_PERMISSIONS]: "Administrative access is required for this action.",

  [ERROR_CODES.VAL_INVALID_INPUT]: "The provided information is invalid. Please check the highlighted fields.",
  [ERROR_CODES.VAL_AMOUNT_INVALID]: "The transaction amount must be greater than zero and have at most two decimal places.",
  [ERROR_CODES.VAL_DATE_OUT_OF_RANGE]: "The specified date is outside the allowable historical range.",
  [ERROR_CODES.VAL_REQUIRED_FIELD_MISSING]: "One or more required fields are missing.",

  [ERROR_CODES.DB_RECORD_NOT_FOUND]: "The requested item could not be found.",
  [ERROR_CODES.DB_RECORD_ALREADY_EXISTS]: "A record with these details already exists.",
  [ERROR_CODES.DB_QUERY_FAILED]: "An error occurred while updating your ledger. Please try again.",
  [ERROR_CODES.DB_CONNECTION_FAILED]: "Database connection temporarily unavailable. Please retry in a moment.",

  [ERROR_CODES.RATE_LIMIT_EXCEEDED]: "Too many requests. Please wait a moment before trying again.",
  [ERROR_CODES.PAYLOAD_TOO_LARGE]: "The submitted request exceeds the maximum allowable payload size.",

  [ERROR_CODES.INTERNAL_SERVER_ERROR]: "An unexpected error occurred. Our engineering team has been alerted.",
  [ERROR_CODES.SERVICE_UNAVAILABLE]: "The service is temporarily undergoing maintenance. Please try again shortly.",
};

export const HTTP_STATUS_MAP: Record<ErrorCode, number> = {
  [ERROR_CODES.AUTH_UNAUTHORIZED]: 401,
  [ERROR_CODES.AUTH_SESSION_EXPIRED]: 401,
  [ERROR_CODES.AUTH_FORBIDDEN]: 403,
  [ERROR_CODES.AUTH_INSUFFICIENT_PERMISSIONS]: 403,

  [ERROR_CODES.VAL_INVALID_INPUT]: 422,
  [ERROR_CODES.VAL_AMOUNT_INVALID]: 422,
  [ERROR_CODES.VAL_DATE_OUT_OF_RANGE]: 422,
  [ERROR_CODES.VAL_REQUIRED_FIELD_MISSING]: 422,

  [ERROR_CODES.DB_RECORD_NOT_FOUND]: 404,
  [ERROR_CODES.DB_RECORD_ALREADY_EXISTS]: 409,
  [ERROR_CODES.DB_QUERY_FAILED]: 500,
  [ERROR_CODES.DB_CONNECTION_FAILED]: 503,

  [ERROR_CODES.RATE_LIMIT_EXCEEDED]: 429,
  [ERROR_CODES.PAYLOAD_TOO_LARGE]: 413,

  [ERROR_CODES.INTERNAL_SERVER_ERROR]: 500,
  [ERROR_CODES.SERVICE_UNAVAILABLE]: 503,
};

export interface ActionErrorEnvelope {
  code: ErrorCode;
  message: string;
  fieldErrors?: Record<string, string[]>;
}

export type ActionResponse<T = unknown> =
  | { success: true; data: T; error?: never }
  | { success: false; data?: never; error: ActionErrorEnvelope };

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly httpStatus: number;
  public readonly fieldErrors?: Record<string, string[]>;

  constructor(code: ErrorCode, customMessage?: string, fieldErrors?: Record<string, string[]>) {
    super(customMessage || SAFE_ERROR_MESSAGES[code] || "An unexpected error occurred.");
    this.name = "AppError";
    this.code = code;
    this.httpStatus = HTTP_STATUS_MAP[code] || 500;
    this.fieldErrors = fieldErrors;
    Object.setPrototypeOf(this, AppError.prototype);
  }

  toEnvelope(): ActionErrorEnvelope {
    return {
      code: this.code,
      message: this.message,
      ...(this.fieldErrors ? { fieldErrors: this.fieldErrors } : {}),
    };
  }
}
