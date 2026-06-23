import { test, expect } from "@playwright/test";

test("two player mode launches Friendship Track without errors", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));

  await page.goto("/play");
  const canvas = page.locator("canvas").first();
  await expect(canvas).toBeVisible({ timeout: 10_000 });
  await page.waitForTimeout(500);

  const box = (await canvas.boundingBox())!;
  // Two Player button.
  await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.94);
  await page.waitForTimeout(2500); // partner turn animation runs first

  await expect(canvas).toBeVisible();
  expect(consoleErrors).toEqual([]);
});

const SUPPORT_MISSIONS = [
  { label: "Speech Garage", x: 0.5 / 6 },
  { label: "Story Cove", x: 1.5 / 6 },
  { label: "Calm Pit Stop", x: 2.5 / 6 },
  { label: "Movement Break", x: 3.5 / 6 },
  { label: "Monster Racer", x: 4.5 / 6 },
];

for (const mission of SUPPORT_MISSIONS) {
  test(`${mission.label} launches from the world map without errors`, async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    page.on("pageerror", (error) => consoleErrors.push(error.message));

    await page.goto("/play");
    const canvas = page.locator("canvas").first();
    await expect(canvas).toBeVisible({ timeout: 10_000 });
    await page.waitForTimeout(500);

    const box = (await canvas.boundingBox())!;
    // Start Mission.
    await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.83);
    await page.waitForTimeout(500);

    // Support mission row.
    await page.mouse.click(box.x + box.width * mission.x, box.y + box.height * 0.93);
    await page.waitForTimeout(700);

    await expect(canvas).toBeVisible();
    expect(consoleErrors).toEqual([]);
  });
}
