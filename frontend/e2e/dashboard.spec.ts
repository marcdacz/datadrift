import { test, expect, type Page } from "@playwright/test";

/**
 * Happy-path E2E flows for login and dashboard.
 *
 * Naming follows AGENT.md: page__when__condition__then__outcome.
 */

async function loginAsDemoAdmin(page: Page) {
  await page.goto("/login");

  await page.getByLabel("Email").fill("admin@datadrift.test");
  await page.getByLabel("Password").fill("password");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(
    page.getByRole("heading", { name: "Dashboard", level: 1 }),
  ).toBeVisible();
}

test.describe("login", () => {
  test("loginPage__when_valid_credentials__then_redirects_to_dashboard", async ({
    page,
  }) => {
    await page.goto("/login");

    await page.getByLabel("Email").fill("admin@datadrift.test");
    await page.getByLabel("Password").fill("password");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(
      page.getByRole("heading", { name: "Dashboard", level: 1 }),
    ).toBeVisible();
    await expect(
      page.getByText("Overview of visualisations, reports, and recent automation runs."),
    ).toBeVisible();
  });
});

test.describe("dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemoAdmin(page);
  });

  test("dashboard__when_loaded__then_shows_core_sections", async ({ page }) => {
    await expect(page.getByText("Visualisations", { exact: true })).toBeVisible();
    await expect(page.getByText("Reports", { exact: true })).toBeVisible();

    // Admins/managers see execution logs in the happy path.
    await expect(page.getByText("Execution logs", { exact: true })).toBeVisible();
  });
});

