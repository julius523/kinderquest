import { test, expect } from "@playwright/test";

async function startMission(page: import("@playwright/test").Page) {
  await page.goto("/play");
  const canvas = page.locator("canvas").first();
  await expect(canvas).toBeVisible({ timeout: 10_000 });
  await page.waitForTimeout(600);
  const box = (await canvas.boundingBox())!;
  await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.83);
  await page.waitForTimeout(700);
  return { canvas, box };
}

test("Flash Cards hub opens from the World Map and a deck plays through", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("pageerror", (error) => consoleErrors.push(error.message));

  const { canvas, box } = await startMission(page);

  // "Flash Cards" button, top-right.
  await page.mouse.click(box.x + box.width * 0.9, box.y + box.height * 0.06);
  await page.waitForTimeout(600);
  await expect(canvas).toBeVisible();

  // First deck button (Alphabet, top-left of the 2-column grid).
  await page.mouse.click(box.x + box.width * (1 / 3), box.y + box.height * 0.32);
  await page.waitForTimeout(600);

  // Tap "Next" a couple of times to flip through cards.
  await page.mouse.click(box.x + box.width * 0.88, box.y + box.height * 0.5);
  await page.waitForTimeout(400);
  await page.mouse.click(box.x + box.width * 0.88, box.y + box.height * 0.5);
  await page.waitForTimeout(400);

  // "Done" returns to the hub.
  await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.92);
  await page.waitForTimeout(400);

  expect(consoleErrors).toEqual([]);
});

test("Sight Words world loads from the World Map without errors", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("pageerror", (error) => consoleErrors.push(error.message));

  const { canvas, box } = await startMission(page);

  // Sight Words node is the last node on the road (x ~0.925, y ~0.38).
  await page.mouse.click(box.x + box.width * 0.925, box.y + box.height * 0.38);
  await page.waitForTimeout(200);
  await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.82);
  await page.waitForTimeout(700);

  await expect(canvas).toBeVisible();
  expect(consoleErrors).toEqual([]);
});
