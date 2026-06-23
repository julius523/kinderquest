import Phaser from "phaser";

function drawStar(
  graphics: Phaser.GameObjects.Graphics,
  cx: number,
  cy: number,
  points: number,
  outerRadius: number,
  innerRadius: number,
): void {
  const step = Math.PI / points;
  graphics.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = i * step - Math.PI / 2;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    if (i === 0) graphics.moveTo(x, y);
    else graphics.lineTo(x, y);
  }
  graphics.closePath();
  graphics.fillPath();
}

/**
 * All visuals in Kinder Quest are generated from code, not loaded image
 * files, so there is no risk of accidentally shipping copyrighted art.
 * Textures are drawn once in white and tinted per-use at the sprite level.
 */
export function generateCoreTextures(scene: Phaser.Scene): void {
  if (scene.textures.exists("tex_car")) return;

  const car = scene.add.graphics();
  car.fillStyle(0xffffff, 1);
  car.fillRoundedRect(5, 24, 120, 36, 14);
  car.fillRoundedRect(28, 2, 70, 26, 10);
  car.fillStyle(0x1a1a2e, 1);
  car.fillCircle(34, 64, 15);
  car.fillCircle(100, 64, 15);
  car.fillStyle(0xffd23f, 1);
  car.fillCircle(34, 64, 6);
  car.fillCircle(100, 64, 6);
  car.generateTexture("tex_car", 134, 80);
  car.destroy();

  const boat = scene.add.graphics();
  boat.fillStyle(0xffffff, 1);
  boat.fillTriangle(10, 60, 110, 60, 90, 10);
  boat.fillRect(10, 60, 100, 16);
  boat.generateTexture("tex_boat", 120, 80);
  boat.destroy();

  const wheel = scene.add.graphics();
  wheel.fillStyle(0xffffff, 1);
  wheel.fillCircle(20, 20, 20);
  wheel.generateTexture("tex_wheel", 40, 40);
  wheel.destroy();

  const star = scene.add.graphics();
  star.fillStyle(0xffffff, 1);
  drawStar(star, 20, 20, 5, 18, 8);
  star.generateTexture("tex_star", 40, 40);
  star.destroy();

  const flag = scene.add.graphics();
  flag.fillStyle(0xffffff, 1);
  flag.fillTriangle(0, 0, 0, 30, 26, 15);
  flag.fillRect(0, 0, 4, 40);
  flag.generateTexture("tex_flag", 30, 40);
  flag.destroy();

  const trophy = scene.add.graphics();
  trophy.fillStyle(0xffffff, 1);
  trophy.fillRoundedRect(14, 4, 32, 28, 8);
  trophy.fillRect(24, 30, 12, 12);
  trophy.fillRoundedRect(16, 42, 28, 8, 4);
  trophy.generateTexture("tex_trophy", 60, 50);
  trophy.destroy();

  const cloud = scene.add.graphics();
  cloud.fillStyle(0xffffff, 1);
  cloud.fillCircle(20, 30, 18);
  cloud.fillCircle(40, 22, 22);
  cloud.fillCircle(62, 30, 18);
  cloud.fillRect(14, 30, 56, 18);
  cloud.generateTexture("tex_cloud", 80, 50);
  cloud.destroy();
}
