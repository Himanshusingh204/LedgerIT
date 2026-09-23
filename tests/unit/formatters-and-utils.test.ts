import { describe, expect, it } from "vitest";
import { formatCurrency, formatSignedCurrency } from "@/lib/formatters/currency";
import { cn } from "@/lib/utils";

describe("Currency Formatters", () => {
  it("formats positive USD amounts correctly", () => {
    const formatted = formatCurrency(1234.56, "USD");
    expect(formatted).toContain("1,234.56");
    expect(formatted).toContain("$");
  });

  it("formats zero amount cleanly", () => {
    const formatted = formatCurrency(0, "USD");
    expect(formatted).toContain("0.00");
  });

  it("formats different currencies properly", () => {
    const eur = formatCurrency(50, "EUR");
    expect(eur).toContain("50.00");

    const gbp = formatCurrency(100, "GBP");
    expect(gbp).toContain("100.00");
  });

  it("handles formatSignedCurrency with explicit signs", () => {
    const positive = formatSignedCurrency(45.5, "USD");
    expect(positive.startsWith("+")).toBe(true);
    expect(positive).toContain("45.50");

    const negative = formatSignedCurrency(-45.5, "USD");
    expect(negative.startsWith("-")).toBe(true);
    expect(negative).toContain("45.50");

    const zero = formatSignedCurrency(0, "USD");
    expect(zero.startsWith("+")).toBe(true);
  });
});

describe("Tailwind & ClassName Utility (cn)", () => {
  it("merges standard class strings", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("filters out falsy and undefined values", () => {
    expect(cn("base-class", false && "hidden", null, undefined, "active")).toBe("base-class active");
  });

  it("resolves conflicting Tailwind utilities properly via tailwind-merge", () => {
    // p-4 should override p-2
    expect(cn("p-2", "p-4")).toBe("p-4");

    // text-white should override text-black
    expect(cn("text-black", "text-white")).toBe("text-white");
  });
});
