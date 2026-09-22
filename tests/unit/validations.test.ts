import { describe, expect, it } from "vitest";
import { accountFormSchema } from "@/lib/validations/account";
import { signInSchema, signUpSchema, forgotPasswordSchema, updatePasswordSchema } from "@/lib/validations/auth";
import { budgetFormSchema } from "@/lib/validations/budget";
import { feedbackFormSchema } from "@/lib/validations/feedback";
import { profileFormSchema } from "@/lib/validations/profile";
import { transactionFormSchema } from "@/lib/validations/transaction";

describe("accountFormSchema", () => {
  const valid = { name: "Everyday Checking", type: "bank" as const, currency: "USD", openingBalance: 100 };

  it.each([
    ["valid input", valid, true],
    ["empty name", { ...valid, name: "" }, false],
    ["invalid type", { ...valid, type: "crypto" }, false],
    ["negative opening balance", { ...valid, openingBalance: -1 }, false],
    ["lastFour with letters", { ...valid, lastFour: "12ab" }, false],
    ["lastFour with 4 digits", { ...valid, lastFour: "1234" }, true],
    ["lastFour omitted", { ...valid, lastFour: undefined }, true],
  ])("%s", (_label, input, shouldPass) => {
    expect(accountFormSchema.safeParse(input).success).toBe(shouldPass);
  });
});

describe("signInSchema / signUpSchema", () => {
  it.each([
    ["valid sign-in", { email: "a@example.com", password: "password123" }, true],
    ["invalid email", { email: "not-an-email", password: "password123" }, false],
    ["short password", { email: "a@example.com", password: "short" }, false],
  ])("signInSchema: %s", (_label, input, shouldPass) => {
    expect(signInSchema.safeParse(input).success).toBe(shouldPass);
  });

  it.each([
    ["valid sign-up", { email: "a@example.com", password: "password123", displayName: "Ada" }, true],
    ["missing displayName", { email: "a@example.com", password: "password123", displayName: "" }, false],
  ])("signUpSchema: %s", (_label, input, shouldPass) => {
    expect(signUpSchema.safeParse(input).success).toBe(shouldPass);
  });
});

describe("forgotPasswordSchema / updatePasswordSchema", () => {
  it("accepts a valid email", () => {
    expect(forgotPasswordSchema.safeParse({ email: "a@example.com" }).success).toBe(true);
  });

  it("rejects an invalid email", () => {
    expect(forgotPasswordSchema.safeParse({ email: "nope" }).success).toBe(false);
  });

  it("accepts a password of at least 8 characters", () => {
    expect(updatePasswordSchema.safeParse({ password: "password123" }).success).toBe(true);
  });

  it("rejects a password under 8 characters", () => {
    expect(updatePasswordSchema.safeParse({ password: "short" }).success).toBe(false);
  });
});

describe("budgetFormSchema", () => {
  const valid = { categoryId: "123e4567-e89b-42d3-a456-426614174000", monthStart: "2026-09-01", amount: 400 };

  it.each([
    ["valid input", valid, true],
    ["non-uuid categoryId", { ...valid, categoryId: "not-a-uuid" }, false],
    ["malformed monthStart", { ...valid, monthStart: "2026-09-15" }, false],
    ["zero amount", { ...valid, amount: 0 }, false],
    ["negative amount", { ...valid, amount: -50 }, false],
  ])("%s", (_label, input, shouldPass) => {
    expect(budgetFormSchema.safeParse(input).success).toBe(shouldPass);
  });
});

describe("feedbackFormSchema", () => {
  const valid = { name: "Ada", email: "ada@example.com", message: "Great app!" };

  it.each([
    ["valid input", valid, true],
    ["empty name", { ...valid, name: "" }, false],
    ["empty message", { ...valid, message: "" }, false],
    ["email omitted", { ...valid, email: "" }, true],
    ["invalid email", { ...valid, email: "nope" }, false],
    ["message too long", { ...valid, message: "a".repeat(2001) }, false],
  ])("%s", (_label, input, shouldPass) => {
    expect(feedbackFormSchema.safeParse(input).success).toBe(shouldPass);
  });
});

describe("profileFormSchema", () => {
  const valid = { displayName: "Ada", currency: "USD", timezone: "America/New_York" };

  it.each([
    ["valid input", valid, true],
    ["empty displayName", { ...valid, displayName: "" }, false],
    ["2-letter currency", { ...valid, currency: "US" }, false],
    ["empty timezone", { ...valid, timezone: "" }, false],
  ])("%s", (_label, input, shouldPass) => {
    expect(profileFormSchema.safeParse(input).success).toBe(shouldPass);
  });

  it("uppercases a lowercase currency code", () => {
    const result = profileFormSchema.safeParse({ ...valid, currency: "usd" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.currency).toBe("USD");
  });
});

describe("transactionFormSchema", () => {
  const valid = {
    type: "expense" as const,
    amount: 42.5,
    accountId: "123e4567-e89b-42d3-a456-426614174000",
    categoryId: "223e4567-e89b-42d3-a456-426614174000",
    occurredAt: "2026-09-15T12:00:00.000Z",
  };

  it.each([
    ["valid input", valid, true],
    ["null categoryId allowed", { ...valid, categoryId: null }, true],
    ["invalid type", { ...valid, type: "loan" }, false],
    ["zero amount", { ...valid, amount: 0 }, false],
    ["negative amount", { ...valid, amount: -10 }, false],
    ["non-uuid accountId", { ...valid, accountId: "abc" }, false],
    ["unparseable occurredAt", { ...valid, occurredAt: "not-a-date" }, false],
  ])("%s", (_label, input, shouldPass) => {
    expect(transactionFormSchema.safeParse(input).success).toBe(shouldPass);
  });
});
