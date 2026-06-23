import { test, expect, type Page } from "@playwright/test";

async function startMissionAndOpenWorldMap(page: Page): Promise<{ x: number; y: number; width: number; height: number }> {
  await page.goto("/play");
  // React StrictMode double-invokes the mount effect in dev, briefly
  // creating a second canvas before the first is destroyed — harmless,
  // but means we must target .first() here.
  const canvas = page.locator("canvas").first();
  await expect(canvas).toBeVisible({ timeout: 10_000 });
  await page.waitForTimeout(400);

  const box = (await canvas.boundingBox())!;
  // Start Mission button.
  await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.8);
  await page.waitForTimeout(400);

  return box;
}

const WORLDS: { label: string; x: number; y: number }[] = [
  { label: "Letter Lagoon", x: 0.2, y: 0.3 },
  { label: "Number Speedway", x: 0.34, y: 0.6 },
  { label: "Shape Harbor", x: 0.48, y: 0.3 },
  { label: "Color City", x: 0.62, y: 0.6 },
  { label: "Listening Lane", x: 0.76, y: 0.3 },
  { label: "Drawing Dock", x: 0.9, y: 0.6 },
];

for (const world of WORLDS) {
  test(`${world.label} loads from the world map without errors`, async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    page.on("pageerror", (error) => consoleErrors.push(error.message));

    const box = await startMissionAndOpenWorldMap(page);

    // Select the world node, then tap Go.
    await page.mouse.click(box.x + box.width * world.x, box.y + box.height * world.y);
    await page.waitForTimeout(200);
    await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.88);
    await page.waitForTimeout(600);

    await expect(page.locator("canvas").first()).toBeVisible();
    expect(consoleErrors).toEqual([]);
  });
}
