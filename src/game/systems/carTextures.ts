import Phaser from "phaser";

export const CAR_COLORS = ["red", "blue", "green", "black"] as const;
export type CarColor = (typeof CAR_COLORS)[number];

const BODY_HEX: Record<CarColor, string> = {
  red: "#ff5a36",
  blue: "#2563eb",
  green: "#16a34a",
  black: "#1f2937",
};

const CANVAS_WIDTH = 160;
const CANVAS_HEIGHT = 100;
const INK = "#1a1a2e";
const GLASS = "#bfe3f8";

/**
 * Manual rounded-rect path. `ctx.roundRect()` only landed in Safari 16
 * (2022) and isn't on every device this app runs on — drawing the path
 * by hand with arcs works on every Canvas 2D implementation that has
 * ever existed, so a car can never silently fail to render here.
 */
function roundedRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arc(x + w - r, y + r, r, -Math.PI / 2, 0);
  ctx.lineTo(x + w, y + h - r);
  ctx.arc(x + w - r, y + h - r, r, 0, Math.PI / 2);
  ctx.lineTo(x + r, y + h);
  ctx.arc(x + r, y + h - r, r, Math.PI / 2, Math.PI);
  ctx.lineTo(x, y + r);
  ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
  ctx.closePath();
}

function fillRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  roundedRectPath(ctx, x, y, w, h, r);
  ctx.fill();
}

function drawWheel(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
  ctx.fillStyle = INK;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#94a3b8";
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = INK;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.16, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * Draws an unmistakable side-view car — the same silhouette as a road
 * sign or parking icon: a body, a cabin with windows, and two big visible
 * wheels. A top-down racing-game sprite (what this used to be) reads as
 * an abstract shape to a young child; a side profile reads as "car"
 * instantly. Faces right (front = headlight side), with a small face on
 * the windshield for personality.
 */
function drawCarOnCanvas(ctx: CanvasRenderingContext2D, bodyColor: string): void {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Chassis (lower body) + cabin (roof + pillars), overlapping so they
  // read as one continuous body.
  ctx.fillStyle = bodyColor;
  fillRoundedRect(ctx, 8, 50, 144, 26, 13);
  fillRoundedRect(ctx, 34, 18, 92, 38, 18);

  // Window band (fixed glass color regardless of body color).
  ctx.fillStyle = GLASS;
  fillRoundedRect(ctx, 44, 26, 72, 22, 10);

  // B-pillar splitting windshield (front, right) from rear window (left).
  ctx.fillStyle = INK;
  ctx.fillRect(74, 26, 4, 22);

  // Wheels — large and unambiguous.
  drawWheel(ctx, 42, 80, 16);
  drawWheel(ctx, 120, 80, 16);

  // Headlight (front/right) and tail light (back/left).
  ctx.fillStyle = "#ffe27a";
  ctx.beginPath();
  ctx.arc(150, 60, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ef4444";
  ctx.beginPath();
  ctx.arc(10, 60, 4, 0, Math.PI * 2);
  ctx.fill();

  // Grounding shadow line along the bottom of the chassis.
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.fillRect(8, 72, 144, 4);

  // Eyes peeking from the front windshield pane (gives personality
  // without losing the "this is a windshield" reading).
  ctx.fillStyle = INK;
  ctx.beginPath();
  ctx.arc(92, 37, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(106, 37, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(93.3, 35.5, 1.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(107.3, 35.5, 1.3, 0, Math.PI * 2);
  ctx.fill();

  // Smile on the hood, between the windshield and the headlight.
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(112, 58, 9, 0.1 * Math.PI, 0.8 * Math.PI);
  ctx.stroke();
}

/** Bare-minimum car using only fillRect/arc — the Canvas 2D primitives
 * every browser has supported since canvas existed. Used only if the
 * detailed drawing above throws on some device, so a car texture is
 * never blank or solid black. */
function drawFallbackCarOnCanvas(ctx: CanvasRenderingContext2D, bodyColor: string): void {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.fillStyle = bodyColor;
  ctx.fillRect(8, 50, 144, 26);
  ctx.fillRect(34, 18, 92, 38);
  ctx.fillStyle = INK;
  ctx.beginPath();
  ctx.arc(42, 80, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(120, 80, 16, 0, Math.PI * 2);
  ctx.fill();
}

export function composeCarTextures(scene: Phaser.Scene): void {
  if (scene.textures.exists("tex_car_red")) return;

  for (const color of CAR_COLORS) {
    const canvas = document.createElement("canvas");
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    const ctx = canvas.getContext("2d");
    if (!ctx) continue;

    try {
      drawCarOnCanvas(ctx, BODY_HEX[color]);
    } catch {
      drawFallbackCarOnCanvas(ctx, BODY_HEX[color]);
    }
    scene.textures.addCanvas(`tex_car_${color}`, canvas);
  }
}
