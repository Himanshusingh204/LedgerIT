import { describe, expect, it } from "vitest";
import { isValidUrl, shortLinkSchema } from "@/lib/validations/short-link";

describe("Short link validation", () => {
  it("accepts https URLs", () => {
    const r = shortLinkSchema.safeParse({ url: "https://example.com/a?b=1" });
    expect(r.success).toBe(true);
  });

  it("rejects javascript protocol", () => {
    expect(isValidUrl("javascript:alert(1)")).toBe(false);
  });

  it("rejects non-url", () => {
    const r = shortLinkSchema.safeParse({ url: "not a url" });
    expect(r.success).toBe(false);
  });

  it("rejects too long urls", () => {
    const r = shortLinkSchema.safeParse({ url: "https://example.com/" + "a".repeat(3000) });
    expect(r.success).toBe(false);
  });
});