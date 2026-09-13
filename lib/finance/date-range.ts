export type RangeKey = "week" | "month" | "quarter" | "year";

export interface DateRange {
  start: Date;
  end: Date;
}

/**
 * Builds a [start, end) date range in the given IANA timezone so period boundaries
 * (e.g. "this month") land on the user's local midnight, not UTC midnight.
 */
export function buildDateRange(range: RangeKey, timezone: string, reference: Date = new Date()): DateRange {
  const parts = getZonedParts(reference, timezone);

  switch (range) {
    case "week": {
      const start = zonedDate(parts.year, parts.month, parts.day, timezone);
      const dayOfWeek = start.getUTCDay();
      start.setUTCDate(start.getUTCDate() - dayOfWeek);
      const end = new Date(start);
      end.setUTCDate(end.getUTCDate() + 7);
      return { start, end };
    }
    case "month": {
      const start = zonedDate(parts.year, parts.month, 1, timezone);
      const end = zonedDate(parts.month === 12 ? parts.year + 1 : parts.year, parts.month === 12 ? 1 : parts.month + 1, 1, timezone);
      return { start, end };
    }
    case "quarter": {
      const quarterStartMonth = Math.floor((parts.month - 1) / 3) * 3 + 1;
      const start = zonedDate(parts.year, quarterStartMonth, 1, timezone);
      const nextQuarterMonth = quarterStartMonth + 3;
      const end =
        nextQuarterMonth > 12
          ? zonedDate(parts.year + 1, nextQuarterMonth - 12, 1, timezone)
          : zonedDate(parts.year, nextQuarterMonth, 1, timezone);
      return { start, end };
    }
    case "year": {
      const start = zonedDate(parts.year, 1, 1, timezone);
      const end = zonedDate(parts.year + 1, 1, 1, timezone);
      return { start, end };
    }
  }
}

export function calculatePreviousPeriod({ start, end }: DateRange): DateRange {
  const durationMs = end.getTime() - start.getTime();
  return {
    start: new Date(start.getTime() - durationMs),
    end: new Date(start.getTime()),
  };
}

export function monthStartISO(date: Date, timezone: string): string {
  const { year, month } = getZonedParts(date, timezone);
  return `${year}-${String(month).padStart(2, "0")}-01`;
}

function getZonedParts(date: Date, timezone: string) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(date);
  const lookup = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  return {
    year: Number(lookup.year),
    month: Number(lookup.month),
    day: Number(lookup.day),
  };
}

/** Returns the UTC instant corresponding to local midnight of (year, month, day) in `timezone`. */
function zonedDate(year: number, month: number, day: number, timezone: string): Date {
  const utcGuess = new Date(Date.UTC(year, month - 1, day));
  const offsetMinutes = getTimezoneOffsetMinutes(utcGuess, timezone);
  return new Date(utcGuess.getTime() - offsetMinutes * 60_000);
}

function getTimezoneOffsetMinutes(date: Date, timezone: string): number {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
  const parts = Object.fromEntries(formatter.formatToParts(date).map((p) => [p.type, p.value]));
  const asUTC = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second),
  );
  return (asUTC - date.getTime()) / 60_000;
}
