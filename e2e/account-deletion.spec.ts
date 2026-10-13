import { test, expect } from "@playwright/test";

// Deletes a real account through the Settings UI, then proves the credentials no longer work.
test("deleting an account removes it and blocks future sign-in", async ({ page }) => {
  const email = `e2e-del-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;
  const password = "Correct-horse-42!";

  await page.goto("/sign-up");
  await page.getByLabel("Name").fill("Delete Me");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL(/dashboard/, { timeout: 30_000 });

  await page.goto("/sign-in");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: /sign in/i }).click();
  await expect(page).toHaveURL(/dashboard/, { timeout: 30_000 });

  await page.goto("/settings");
  await page.locator("#delete-confirm").fill("nope");
  await page.getByRole("button", { name: "Delete my account" }).click();
  await expect(page.getByText("Type DELETE in the box to confirm.")).toBeVisible();

  await page.locator("#delete-confirm").fill("DELETE");
  await page.getByRole("button", { name: "Delete my account" }).click();
  await expect(page).toHaveURL(/account=deleted/, { timeout: 30_000 });

  await page.goto("/sign-in");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: /sign in/i }).click();
  await expect(page).not.toHaveURL(/dashboard/, { timeout: 15_000 });
});
