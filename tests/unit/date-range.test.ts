import { describe, expect, it } from "vitest";
import { buildDateRange, calculatePreviousPeriod, monthStartISO } from "@/lib/finance/date-range";

const TZ = "America/New_York";

describe("buildDateRange", () => {
  it("builds a month range starting on the 1st in the given timezone", () => {
    const reference = new Date("2026-03-15T12:00:00Z");
    const { start, end } = buildDateRange("month", TZ, reference);

    expect(start.toISOString()).toBe("2026-03-01T05:00:00.000Z");
    expect(end.toISOString()).toBe("2026-04-01T04:00:00.000Z");
  });

  it("builds a year range spanning Jan 1 to Jan 1 next year", () => {
    const reference = new Date("2026-03-15T12:00:00Z");
    const { start, end } = buildDateRange("year", TZ, reference);

    expect(start.getUTCFullYear()).toBe(2026);
    expect(end.getUTCFullYear()).toBe(2027);
  });
});

describe("calculatePreviousPeriod", () => {
  it("shifts the window back by its own duration", () => {
    const start = new Date("2026-03-01T05:00:00.000Z");
    const end = new Date("2026-04-01T04:00:00.000Z");

    const previous = calculatePreviousPeriod({ start, end });

    expect(previous.end.getTime()).toBe(start.getTime());
    expect(previous.end.getTime() - previous.start.getTime()).toBe(end.getTime() - start.getTime());
  });
});

describe("monthStartISO", () => {
  it("formats the zoned month start as YYYY-MM-01", () => {
    const reference = new Date("2026-03-15T12:00:00Z");
    expect(monthStartISO(reference, TZ)).toBe("2026-03-01");
  });
});
