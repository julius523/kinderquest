import { test, expect } from "@playwright/test";

test("child home page loads, reads the welcome message, and navigates to play", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));

  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Kinder Quest" })).toBeVisible();
  await expect(page.getByText("Welcome to Kinder Quest. You are Super Racer!")).toBeVisible();

  const playButton = page.getByRole("button", { name: "Play" });
  await expect(playButton).toBeVisible();
  await playButton.click();

  await expect(page).toHaveURL(/\/play$/);
  expect(consoleErrors).toEqual([]);
});
