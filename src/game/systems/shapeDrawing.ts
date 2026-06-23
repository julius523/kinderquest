import Phaser from "phaser";
import { drawStar } from "./generateCoreTextures";

/** Draws any of the 8 core shapes used across Shape Harbor and the Shapes
 * flash card deck, centered at (cx, cy), sized to fit roughly in a
 * `size`x`size` box. */
export function drawShape(
  graphics: Phaser.GameObjects.Graphics,
  shape: string,
  cx: number,
  cy: number,
  size: number,
  color: number,
): void {
  graphics.fillStyle(color, 1);

  switch (shape) {
    case "circle":
      graphics.fillCircle(cx, cy, size / 2);
      break;
    case "square":
      graphics.fillRect(cx - size / 2, cy - size / 2, size, size);
      break;
    case "rectangle":
      graphics.fillRect(cx - size * 0.6, cy - size * 0.4, size * 1.2, size * 0.8);
      break;
    case "triangle":
      graphics.fillTriangle(
        cx,
        cy - size / 2,
        cx - size / 2,
        cy + size / 2,
        cx + size / 2,
        cy + size / 2,
      );
      break;
    case "star":
      drawStar(graphics, cx, cy, 5, size / 2, size / 4);
      break;
    case "diamond":
      graphics.fillTriangle(cx, cy - size / 2, cx - size / 2, cy, cx + size / 2, cy);
      graphics.fillTriangle(cx - size / 2, cy, cx + size / 2, cy, cx, cy + size / 2);
      break;
    case "oval":
      graphics.fillEllipse(cx, cy, size * 1.2, size * 0.8);
      break;
    case "heart": {
      const r = size / 4;
      graphics.fillCircle(cx - r, cy - r * 0.5, r);
      graphics.fillCircle(cx + r, cy - r * 0.5, r);
      graphics.fillTriangle(cx - size / 2, cy - r * 0.2, cx + size / 2, cy - r * 0.2, cx, cy + size / 2);
      break;
    }
    default:
      graphics.fillCircle(cx, cy, size / 2);
  }
}
