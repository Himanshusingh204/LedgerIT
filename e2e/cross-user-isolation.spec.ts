import { test, expect, type Page } from "@playwright/test";

/**
 * Browser-driven complement to tests/integration/rls.test.ts. That suite hits the Supabase REST
 * API directly to prove the RLS *boundary* holds; this one drives two real signed-in sessions
 * through the actual app UI to prove a user never even sees a reachable link, button, or row that
 * would expose another user's data — the original Phase 10 (build) pass only checked this via raw
 * REST calls, never through the UI itself.
 */

const password = "TestPassword123!";

async function signUp(page: Page, name: string): Promise<string> {
  // Assumes email confirmation is disabled locally — sign-up returns a live session immediately
  // and lands on /dashboard directly (see the same note in e2e/app-flow.spec.ts).
  const email = `isolation-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
  await page.goto("/sign-up");
  await page.getByLabel("Name").fill(name);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL(/\/dashboard/);

  return email;
}

test("user B never sees user A's account or transaction through the app", async ({ browser }) => {
  const contextA = await browser.newContext();
  const pageA = await contextA.newPage();
  await signUp(pageA, "User A");

  await pageA.goto("/settings");
  await pageA.getByRole("button", { name: "Add account" }).click();
  await pageA.locator("#account-name").fill("User A Secret Account");
  await pageA.getByRole("button", { name: "Add account", exact: true }).click();
  await expect(pageA.getByText("User A Secret Account")).toBeVisible();

  await pageA.goto("/transactions");
  await pageA.getByRole("button", { name: "Add transaction" }).click();
  const dialog = pageA.getByRole("dialog");
  await dialog.getByLabel("Amount").fill("999.99");
  await dialog.getByLabel("Account", { exact: true }).selectOption({ label: "User A Secret Account" });
  await dialog.getByLabel("Merchant").fill("User A Secret Merchant");
  await dialog.getByRole("button", { name: "Save transaction" }).click();
  await expect(pageA.getByText("User A Secret Merchant").filter({ visible: true })).toBeVisible();

  const contextB = await browser.newContext();
  const pageB = await contextB.newPage();
  await signUp(pageB, "User B");

  // B needs her own account — the "Add transaction" button below is disabled with zero accounts
  // (components/transactions/add-transaction-button.tsx), which would make the dropdown check
  // unreachable regardless of whether isolation holds.
  await pageB.goto("/settings");
  await pageB.getByRole("button", { name: "Add account" }).click();
  await pageB.locator("#account-name").fill("User B Own Account");
  await pageB.getByRole("button", { name: "Add account", exact: true }).click();
  await expect(pageB.getByText("User B Own Account")).toBeVisible();

  await pageB.goto("/dashboard");
  await expect(pageB.getByText("User A Secret Account")).not.toBeVisible();
  await expect(pageB.getByText("User A Secret Merchant")).not.toBeVisible();
  await expect(pageB.getByText("$999.99")).not.toBeVisible();

  await pageB.goto("/settings");
  await expect(pageB.getByText("User A Secret Account")).not.toBeVisible();

  await pageB.goto("/transactions");
  await expect(pageB.getByText("User A Secret Merchant")).not.toBeVisible();
  await pageB.getByLabel("Search transactions by merchant").fill("Secret");
  await expect(pageB.getByText("No transactions")).toBeVisible();

  // The account dropdown in B's own "add transaction" dialog must not list A's account either —
  // a select populated from the wrong query would leak its existence even if rows stayed hidden.
  await pageB.getByRole("button", { name: "Add transaction" }).click();
  const dialogB = pageB.getByRole("dialog");
  const accountOptions = await dialogB.getByLabel("Account", { exact: true }).locator("option").allTextContents();
  expect(accountOptions.join(" ")).not.toContain("User A Secret Account");

  await contextA.close();
  await contextB.close();
});
