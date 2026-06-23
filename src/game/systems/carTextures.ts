import Phaser from "phaser";

export const CAR_COLORS = ["red", "blue", "green", "black"] as const;
export type CarColor = (typeof CAR_COLORS)[number];

const CAR_WIDTH = 71;
const CAR_HEIGHT = 131;
const INK = "#1a1a2e";

function drawFaceOnCanvas(ctx: CanvasRenderingContext2D): void {
  const leftEyeX = CAR_WIDTH * 0.32;
  const rightEyeX = CAR_WIDTH * 0.68;
  const eyeY = CAR_HEIGHT * 0.28;
  const eyeRadius = CAR_WIDTH * 0.13;

  ctx.fillStyle = INK;
  ctx.beginPath();
  ctx.arc(leftEyeX, eyeY, eyeRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(rightEyeX, eyeY, eyeRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.beginPath();
  ctx.arc(leftEyeX - eyeRadius * 0.3, eyeY - eyeRadius * 0.3, eyeRadius * 0.35, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(rightEyeX - eyeRadius * 0.3, eyeY - eyeRadius * 0.3, eyeRadius * 0.35, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = INK;
  ctx.lineWidth = 3;
  ctx.beginPath();
  const midX = (leftEyeX + rightEyeX) / 2;
  const mouthY = CAR_HEIGHT * 0.42;
  const mouthWidth = CAR_WIDTH * 0.5;
  ctx.arc(midX, mouthY - 6, mouthWidth / 2, 0.15 * Math.PI, 0.85 * Math.PI, false);
  ctx.stroke();
}

/**
 * Loads the licensed Kenney car sprites (see src/assets/README.md) and
 * bakes a drawn face (eyes + smile) on top of each one into a single
 * reusable texture per color — keeping Kinder Quest's "talking car"
 * personality while using better-looking base art than our hand-drawn
 * shapes. Composing once at boot means every other scene can keep using
 * a plain `this.add.image(x, y, "tex_car_red")` like before.
 *
 * Uses a plain 2D canvas rather than Phaser's RenderTexture — Phaser 4
 * changed RenderTexture's render/redraw semantics in a way that made
 * baked draws not reliably persist into a saved texture.
 */
export function preloadCarSprites(scene: Phaser.Scene): void {
  for (const color of CAR_COLORS) {
    scene.load.image(`car_raw_${color}`, `/assets/cars/car_${color}.png`);
  }
}

export function composeCarTextures(scene: Phaser.Scene): void {
  if (scene.textures.exists("tex_car_red")) return;

  for (const color of CAR_COLORS) {
    const sourceImage = scene.textures.get(`car_raw_${color}`).getSourceImage() as
      | HTMLImageElement
      | HTMLCanvasElement;

    const canvas = document.createElement("canvas");
    canvas.width = CAR_WIDTH;
    canvas.height = CAR_HEIGHT;
    const ctx = canvas.getContext("2d");
    if (!ctx) continue;

    ctx.drawImage(sourceImage, 0, 0, CAR_WIDTH, CAR_HEIGHT);
    drawFaceOnCanvas(ctx);

    scene.textures.addCanvas(`tex_car_${color}`, canvas);
  }
}
