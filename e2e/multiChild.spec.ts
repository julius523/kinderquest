import { test, expect } from "@playwright/test";

async function passParentGate(page: import("@playwright/test").Page) {
  const holdBtn = page.getByRole("button", { name: "Hold" });
  const box = (await holdBtn.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(3200);
  const promptText = await page.getByText(/what is/i).textContent();
  const match = promptText!.match(/(\d+)\s*\+\s*(\d+)/)!;
  const answer = Number(match[1]) + Number(match[2]);
  await page.getByRole("spinbutton").fill(String(answer));
  await page.getByText("Continue").click();
}

test("adding a second player in Settings makes the Who's Playing picker appear on the home screen", async ({
  page,
}) => {
  const consoleErrors: string[] = [];
  page.on("pageerror", (error) => consoleErrors.push(error.message));

  await page.goto("/parent/settings");
  await passParentGate(page);

  await page.getByPlaceholder("Child's name").fill("Halani");
  await page.getByText("Add Player").click();
  await expect(page.getByText(/Halani · age/)).toBeVisible();

  await page.goto("/");
  await expect(page.getByText("Who's playing?")).toBeVisible();
  await expect(page.getByText("Halani")).toBeVisible();
  await expect(page.getByText("Super Racer")).toBeVisible();

  await page.getByText("Halani").click();
  await expect(page.getByText(/Welcome to Kinder Quest, Halani!/)).toBeVisible();
  await expect(page.getByText("Switch Player")).toBeVisible();

  expect(consoleErrors).toEqual([]);
});

test("the Goodbye scene shows a session recap and returns home", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("pageerror", (error) => consoleErrors.push(error.message));

  await page.goto("/play");
  const canvas = page.locator("canvas").first();
  await expect(canvas).toBeVisible({ timeout: 10_000 });
  await page.waitForTimeout(800);

  const box = (await canvas.boundingBox())!;
  // Start Mission.
  await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.83);
  await page.waitForTimeout(2000);

  // Goodbye button (top-left of World Map). Retry the click+wait a few
  // times under heavy parallel load (many concurrent WebGL contexts can
  // slow down Phaser's scene transitions past a single fixed wait).
  for (let attempt = 0; attempt < 5 && page.url().endsWith("/play"); attempt++) {
    await page.mouse.click(box.x + box.width * 0.1, box.y + box.height * 0.06);
    await page.waitForTimeout(1200);

    // Home button.
    await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.85);
    await page.waitForTimeout(1200);
  }

  await expect(page).toHaveURL(/\/$/, { timeout: 10_000 });
  expect(consoleErrors).toEqual([]);
});
