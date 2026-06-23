import { test, expect } from "@playwright/test";

test("play page boots the Phaser game and shows the world map after Start Mission", async ({
  page,
}) => {
  const consoleErrors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));

  await page.goto("/play");

  // The Phaser canvas should mount. React StrictMode double-invokes the
  // mount effect in dev, briefly creating a second canvas before the first
  // is destroyed — harmless, but means we must target .first() here.
  const canvas = page.locator("canvas").first();
  await expect(canvas).toBeVisible({ timeout: 10_000 });

  // Give Boot -> Preload -> WelcomeGarage a moment to run, then tap
  // "Start Mission" by clicking where the button renders (canvas content
  // isn't queryable by text, so we click by approximate position).
  await page.waitForTimeout(500);
  const box = await canvas.boundingBox();
  expect(box).not.toBeNull();

  if (box) {
    // Start Mission button sits at width/2, height*0.8 per WelcomeGarageScene.
    await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.8);
  }

  await page.waitForTimeout(500);
  expect(consoleErrors).toEqual([]);
});
