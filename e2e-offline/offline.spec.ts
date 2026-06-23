import { test, expect } from "@playwright/test";

test("the child home page still works after going offline", async ({ page, context }) => {
  await page.goto("/");
  await page.evaluate(async () => {
    if ("serviceWorker" in navigator) await navigator.serviceWorker.ready;
  });
  await page.waitForTimeout(500);

  await context.setOffline(true);
  await page.reload();

  await expect(page.getByRole("heading", { name: "Kinder Quest" })).toBeVisible();
  await expect(page.getByText("Welcome to Kinder Quest. You are Super Racer!")).toBeVisible();
});

test("the /play route (including the Phaser game) still works after going offline", async ({
  page,
  context,
}) => {
  await page.goto("/");
  await page.evaluate(async () => {
    if ("serviceWorker" in navigator) await navigator.serviceWorker.ready;
  });

  // Visit /play once online so its lazy-loaded chunk is fetched and
  // precached before we cut the network.
  await page.goto("/play");
  await page.locator("canvas").first().waitFor({ state: "visible", timeout: 10_000 });
  await page.waitForTimeout(500);

  await context.setOffline(true);
  await page.reload();

  await expect(page.locator("canvas").first()).toBeVisible({ timeout: 10_000 });
});

test("a direct reload of a client-routed page (e.g. /parent-gate) does not fall back to the offline page while online", async ({
  page,
}) => {
  // Regression guard for navigateFallback misconfiguration: this route
  // has no dedicated server-side file, so if navigateFallback ever points
  // at offline.html again instead of index.html, this would render the
  // "pit stop" offline message instead of the real app shell — even
  // while fully online.
  await page.goto("/parent-gate");
  await expect(page.getByText(/pit stop/i)).not.toBeVisible();
});
