import { test, expect } from "@playwright/test";

/**
 * Dashboard E2E. AGENT.md naming: page__when__then.
 * TODO: Add validation errors and auth restriction tests when features exist.
 */
test.describe("dashboard", () => {
  test("dashboard__when_app_loads__then_shows_dashboard_title", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Dashboard", level: 1 })).toBeVisible();
  });

  test("dashboard__when_app_loads__then_shows_sidebar_navigation", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Dashboard" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Settings" })).toBeVisible();
  });

  test("dashboard__when_app_loads__then_shows_health_status", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("status").filter({ hasText: /Backend connected|Backend unreachable|Checking backend/ })
    ).toBeVisible();
  });
});
