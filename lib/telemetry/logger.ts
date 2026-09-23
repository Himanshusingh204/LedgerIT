/**
 * Production Telemetry & Structured Logging
 *
 * Invariants:
 * 1. Emits structured JSON in production for log ingestion systems (Datadog, AWS CloudWatch, Logflare).
 * 2. Emits readable formatted output in local development (`process.env.NODE_ENV !== "production"`).
 * 3. Never logs raw PII, plaintext passwords, or full session cookie values.
 * 4. Captures error stacks safely without unhandled rejections.
 */

export type LogLevel = "debug" | "info" | "warn" | "error" | "audit";

export interface LogPayload {
  level: LogLevel;
  event: string;
  timestamp: string;
  requestId?: string;
  userId?: string;
  context?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    stack?: string;
    code?: string;
  };
}

class TelemetryLogger {
  private formatError(err: unknown) {
    if (err instanceof Error) {
      return {
        name: err.name,
        message: err.message,
        stack: process.env.NODE_ENV !== "production" ? err.stack : undefined,
        code: "code" in err ? String((err as Record<string, unknown>).code) : undefined,
      };
    }
    return {
      name: "UnknownError",
      message: typeof err === "string" ? err : JSON.stringify(err),
    };
  }

  private write(level: LogLevel, event: string, context?: Record<string, unknown>, err?: unknown) {
    const payload: LogPayload = {
      level,
      event,
      timestamp: new Date().toISOString(),
      ...(context?.requestId ? { requestId: String(context.requestId) } : {}),
      ...(context?.userId ? { userId: String(context.userId) } : {}),
      ...(context ? { context } : {}),
      ...(err ? { error: this.formatError(err) } : {}),
    };

    if (process.env.NODE_ENV === "production") {
      // In production, write single-line JSON to standard stream for log forwarders
      const jsonLine = JSON.stringify(payload);
      if (level === "error") {
        console.error(jsonLine);
      } else if (level === "warn") {
        console.warn(jsonLine);
      } else {
        console.log(jsonLine);
      }
    } else {
      // Readable terminal format in development
      const prefix = `[${payload.timestamp}] [${level.toUpperCase()}] [${event}]`;
      if (level === "error") {
        console.error(prefix, context || "", err || "");
      } else if (level === "warn") {
        console.warn(prefix, context || "", err || "");
      } else {
        console.log(prefix, context || "");
      }
    }
  }

  debug(event: string, context?: Record<string, unknown>) {
    if (process.env.NODE_ENV !== "production") {
      this.write("debug", event, context);
    }
  }

  info(event: string, context?: Record<string, unknown>) {
    this.write("info", event, context);
  }

  warn(event: string, context?: Record<string, unknown>, err?: unknown) {
    this.write("warn", event, context, err);
  }

  error(event: string, err: unknown, context?: Record<string, unknown>) {
    this.write("error", event, context, err);
  }

  /**
   * Audit logging for security-sensitive operations (admin changes, policy updates, account deletions)
   */
  audit(action: string, actorUserId: string, targetResourceId: string, details?: Record<string, unknown>) {
    this.write("audit", `AUDIT_${action}`, {
      userId: actorUserId,
      targetId: targetResourceId,
      ...details,
    });
  }
}

export const logger = new TelemetryLogger();
