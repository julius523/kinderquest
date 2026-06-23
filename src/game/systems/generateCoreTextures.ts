import Phaser from "phaser";

export const INK = 0x1a1a2e;
const SHINE = 0xe2e8f0;

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

export function drawFace(
  graphics: Phaser.GameObjects.Graphics,
  leftEyeX: number,
  rightEyeX: number,
  eyeY: number,
  eyeRadius: number,
  mouthY: number,
  mouthWidth: number,
): void {
  graphics.fillStyle(INK, 1);
  graphics.fillCircle(leftEyeX, eyeY, eyeRadius);
  graphics.fillCircle(rightEyeX, eyeY, eyeRadius);
  graphics.fillStyle(0xffffff, 0.9);
  graphics.fillCircle(leftEyeX - eyeRadius * 0.3, eyeY - eyeRadius * 0.3, eyeRadius * 0.35);
  graphics.fillCircle(rightEyeX - eyeRadius * 0.3, eyeY - eyeRadius * 0.3, eyeRadius * 0.35);

  graphics.lineStyle(3, INK, 1);
  graphics.beginPath();
  const midX = (leftEyeX + rightEyeX) / 2;
  graphics.arc(midX, mouthY - 6, mouthWidth / 2, 0.15 * Math.PI, 0.85 * Math.PI, false);
  graphics.strokePath();
}

/**
 * All visuals in Kinder Quest are generated from code, not loaded image
 * files, so there is no risk of accidentally shipping copyrighted art.
 * Textures are drawn once in white (plus fixed-color details like eyes and
 * accents) and tinted per-use at the sprite level — white areas take the
 * full tint color, dark "ink" details stay dark so faces read clearly on
 * any color car or boat.
 */
export function generateCoreTextures(scene: Phaser.Scene): void {
  if (scene.textures.exists("tex_boat")) return;

  // --- Talking boat friend, curved hull via uneven corner radii ---
  const boat = scene.add.graphics();
  boat.fillStyle(0xffffff, 1);
  boat.fillRoundedRect(8, 52, 124, 38, { tl: 4, tr: 4, bl: 34, br: 34 });
  boat.fillStyle(SHINE, 0.6);
  boat.fillRect(8, 52, 124, 10);
  boat.fillStyle(INK, 1);
  boat.fillRect(66, 4, 5, 56);
  boat.fillStyle(0xffffff, 1);
  boat.fillTriangle(71, 10, 71, 54, 122, 48);
  boat.fillStyle(0xffd23f, 1);
  boat.fillTriangle(66, 4, 66, 16, 88, 8);
  drawFace(boat, 36, 58, 70, 7, 84, 30);
  boat.generateTexture("tex_boat", 140, 96);
  boat.destroy();

  // A plain, faceless, tintable silhouette — used where color conveys
  // *state* (tapped/correct) rather than character identity, since the
  // real Kenney car sprites are pre-colored and don't tint cleanly.
  const carPlain = scene.add.graphics();
  carPlain.fillStyle(0xffffff, 1);
  carPlain.fillRoundedRect(6, 56, 148, 46, 23);
  carPlain.fillRoundedRect(40, 14, 90, 50, 24);
  carPlain.fillStyle(INK, 1);
  carPlain.fillCircle(38, 96, 17);
  carPlain.fillCircle(124, 96, 17);
  carPlain.generateTexture("tex_car_plain", 160, 112);
  carPlain.destroy();

  const wheel = scene.add.graphics();
  wheel.fillStyle(0xffffff, 1);
  wheel.fillCircle(20, 20, 20);
  wheel.fillStyle(INK, 1);
  wheel.fillCircle(20, 20, 12);
  wheel.fillStyle(SHINE, 1);
  wheel.fillCircle(20, 20, 5);
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
  trophy.lineStyle(4, 0xffffff, 1);
  trophy.beginPath();
  trophy.arc(10, 12, 8, Math.PI * 0.3, Math.PI * 1.3, true);
  trophy.strokePath();
  trophy.beginPath();
  trophy.arc(50, 12, 8, Math.PI * 1.7, Math.PI * 0.7, true);
  trophy.strokePath();
  trophy.fillStyle(0xfff7ed, 0.8);
  drawStar(trophy, 30, 16, 5, 7, 3);
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

  const sun = scene.add.graphics();
  sun.fillStyle(0xffd23f, 1);
  sun.fillCircle(30, 30, 18);
  sun.lineStyle(5, 0xffd23f, 1);
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    sun.beginPath();
    sun.moveTo(30 + Math.cos(angle) * 24, 30 + Math.sin(angle) * 24);
    sun.lineTo(30 + Math.cos(angle) * 30, 30 + Math.sin(angle) * 30);
    sun.strokePath();
  }
  sun.generateTexture("tex_sun", 60, 60);
  sun.destroy();

  const bush = scene.add.graphics();
  bush.fillStyle(0xffffff, 1);
  bush.fillCircle(15, 20, 14);
  bush.fillCircle(30, 14, 16);
  bush.fillCircle(45, 20, 14);
  bush.fillRect(8, 20, 44, 10);
  bush.generateTexture("tex_bush", 60, 32);
  bush.destroy();

  // A visible reward: drawn behind the car once a super-suit reward is
  // unlocked, so progression is something the child can actually see.
  const cape = scene.add.graphics();
  cape.fillStyle(0xffffff, 1);
  cape.beginPath();
  cape.moveTo(20, 0);
  cape.lineTo(60, 0);
  cape.lineTo(70, 70);
  cape.lineTo(40, 90);
  cape.lineTo(10, 70);
  cape.closePath();
  cape.fillPath();
  cape.generateTexture("tex_cape", 80, 90);
  cape.destroy();
}
