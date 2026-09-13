import { test, expect } from "@playwright/test";

/**
 * End-to-end happy path from docs/04-development-plan.md §E2E. Requires a live Supabase
 * project wired up via .env.local — this suite cannot run against the placeholder client.
 * Each run signs up a fresh user (timestamped email) since there's no test-data reset yet.
 */

const password = "TestPassword123!";
const email = `e2e-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;

test.describe("core app flow", () => {
  test("sign up, add a transaction, set a budget, filter and export", async ({ page }) => {
    await test.step("visit home page", async () => {
      await page.goto("/");
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    });

    await test.step("sign up", async () => {
      await page.goto("/sign-up");
      await page.getByLabel("Name").fill("E2E Test User");
      await page.getByLabel("Email").fill(email);
      await page.getByLabel("Password").fill(password);
      await page.getByRole("button", { name: "Create account" }).click();
      await expect(page.getByText("Check your email")).toBeVisible();
    });

    // Assumes email confirmation is disabled in the Supabase project's auth settings
    // for local/dev testing, otherwise this step must confirm the email first.
    await test.step("sign in", async () => {
      await page.goto("/sign-in");
      await page.getByLabel("Email").fill(email);
      await page.getByLabel("Password").fill(password);
      await page.getByRole("button", { name: "Sign in" }).click();
      await expect(page).toHaveURL(/\/dashboard/);
    });

    await test.step("create a financial account", async () => {
      await page.goto("/settings");
      await page.getByRole("button", { name: "Add account" }).click();
      await page.locator("#account-name").fill("Everyday checking");
      await page.getByRole("button", { name: "Add account", exact: true }).click();
      await expect(page.getByText("Everyday checking")).toBeVisible();
    });

    await test.step("add an expense", async () => {
      await page.goto("/transactions");
      await page.getByRole("button", { name: "Add transaction" }).click();
      const dialog = page.getByRole("dialog");
      await dialog.getByLabel("Amount").fill("42.50");
      await dialog.getByLabel("Account", { exact: true }).selectOption({ label: "Everyday checking" });
      await dialog.getByLabel("Merchant").fill("Grocery Store");
      await dialog.getByRole("button", { name: "Save transaction" }).click();
      await expect(page.getByText("Grocery Store").filter({ visible: true })).toBeVisible();
    });

    await test.step("confirm dashboard reflects the expense", async () => {
      await page.goto("/dashboard");
      await expect(page.getByText("$42.50").first()).toBeVisible();
    });

    await test.step("add income", async () => {
      await page.goto("/transactions");
      await page.getByRole("button", { name: "Add transaction" }).click();
      const dialog = page.getByRole("dialog");
      await dialog.getByLabel("Income").check({ force: true });
      await dialog.getByLabel("Amount").fill("1000");
      await dialog.getByLabel("Account", { exact: true }).selectOption({ label: "Everyday checking" });
      await dialog.getByLabel("Merchant").fill("Employer");
      await dialog.getByRole("button", { name: "Save transaction" }).click();
    });

    await test.step("confirm net change updates", async () => {
      await page.goto("/dashboard");
      await expect(page.getByText("$1,000.00").first()).toBeVisible();
    });

    await test.step("create a monthly budget", async () => {
      await page.goto("/budgets");
      const firstRow = page.locator("text=Set budget").first();
      await firstRow.click();
      await page.getByRole("spinbutton").first().fill("200");
      await page.getByRole("button", { name: "Save" }).click();
    });

    await test.step("filter the transaction list", async () => {
      await page.goto("/transactions");
      await page.getByLabel("Search transactions by merchant").fill("Grocery");
      await expect(page.getByText("Grocery Store").filter({ visible: true })).toBeVisible();
      await expect(page.getByText("Employer").filter({ visible: true })).not.toBeVisible();
    });

    await test.step("export CSV", async () => {
      const downloadPromise = page.waitForEvent("download");
      await page.getByRole("link", { name: "Export CSV" }).click();
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toMatch(/^transactions-.*\.csv$/);
    });

    await test.step("mobile navigation works", async () => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto("/dashboard");
      await page.getByRole("button", { name: "Open menu" }).click();
      await page.getByRole("link", { name: "Transactions" }).click();
      await expect(page).toHaveURL(/\/transactions/);
    });
  });
});
