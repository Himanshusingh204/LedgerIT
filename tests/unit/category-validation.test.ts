import { describe, expect, it } from "vitest";
import { categoryFormSchema, categoryKindSchema } from "@/lib/validations/category";

describe("categoryKindSchema", () => {
  it("accepts 'expense' and 'income'", () => {
    expect(categoryKindSchema.safeParse("expense").success).toBe(true);
    expect(categoryKindSchema.safeParse("income").success).toBe(true);
  });

  it("rejects unknown kinds like 'crypto' or 'transfer'", () => {
    expect(categoryKindSchema.safeParse("crypto").success).toBe(false);
    expect(categoryKindSchema.safeParse("transfer").success).toBe(false);
    expect(categoryKindSchema.safeParse("").success).toBe(false);
  });
});

describe("categoryFormSchema", () => {
  it("accepts valid category form payload", () => {
    const valid = { name: "Groceries", kind: "expense" };
    expect(categoryFormSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects empty name after trimming whitespace", () => {
    const invalid = { name: "   ", kind: "expense" };
    expect(categoryFormSchema.safeParse(invalid).success).toBe(false);
  });

  it("rejects names exceeding 60 characters", () => {
    const invalid = { name: "A".repeat(61), kind: "income" };
    expect(categoryFormSchema.safeParse(invalid).success).toBe(false);
  });

  it("accepts names up to 60 characters", () => {
    const valid = { name: "A".repeat(60), kind: "income" };
    expect(categoryFormSchema.safeParse(valid).success).toBe(true);
  });
});
