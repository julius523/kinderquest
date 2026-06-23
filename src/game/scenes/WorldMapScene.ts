import Phaser from "phaser";
import { speak } from "../../services/textToSpeechService";
import { createBigButton } from "../systems/uiFactory";

type WorldNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  unlocked: boolean;
};

const WORLD_NODES: WorldNode[] = [
  { id: "welcome_garage", label: "Garage", x: 0.08, y: 0.55, unlocked: true },
  { id: "letter_lagoon", label: "Letter Lagoon", x: 0.24, y: 0.32, unlocked: true },
  { id: "number_speedway", label: "Number Speedway", x: 0.4, y: 0.62, unlocked: false },
  { id: "shape_harbor", label: "Shape Harbor", x: 0.56, y: 0.32, unlocked: false },
  { id: "color_city", label: "Color City", x: 0.72, y: 0.62, unlocked: false },
  { id: "trophy_celebration", label: "Trophy", x: 0.9, y: 0.4, unlocked: false },
];

/** The Kinder Quest Road: a big path map showing the current mission,
 * locked future worlds, and trophy progress. Activity-scene wiring for
 * each world lands in Phase 6. */
export class WorldMapScene extends Phaser.Scene {
  constructor() {
    super("WorldMapScene");
  }

  create(): void {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor("#e0f2fe");

    this.add
      .text(width / 2, height * 0.08, "Kinder Quest Road", {
        fontFamily: "system-ui, sans-serif",
        fontSize: "34px",
        fontStyle: "bold",
        color: "#0369a1",
      })
      .setOrigin(0.5);

    speak("Here is the road. Pick a mission!");

    const points = WORLD_NODES.map((node) => ({ x: width * node.x, y: height * node.y }));
    const path = this.add.graphics();
    path.lineStyle(6, 0xbae6fd, 1);
    path.beginPath();
    path.moveTo(points[0].x, points[0].y);
    for (const point of points.slice(1)) {
      path.lineTo(point.x, point.y);
    }
    path.strokePath();

    const currentWorldId = "letter_lagoon";

    WORLD_NODES.forEach((node, index) => {
      const { x, y } = points[index];
      const isCurrent = node.id === currentWorldId;

      const circle = this.add.circle(x, y, isCurrent ? 38 : 30, node.unlocked ? 0xffffff : 0xcbd5e1);
      circle.setStrokeStyle(4, isCurrent ? 0xff5a36 : node.unlocked ? 0x0ea5e9 : 0x94a3b8);

      if (isCurrent) {
        this.tweens.add({ targets: circle, scale: 1.15, duration: 650, yoyo: true, repeat: -1 });
      }

      this.add
        .text(x, y + (isCurrent ? 56 : 46), node.label, {
          fontFamily: "system-ui, sans-serif",
          fontSize: "15px",
          fontStyle: node.unlocked ? "bold" : "normal",
          color: node.unlocked ? "#334155" : "#94a3b8",
        })
        .setOrigin(0.5);

      if (node.unlocked) {
        circle.setInteractive({ useHandCursor: true });
        circle.on("pointerdown", () => speak(node.label));
      }
    });

    createBigButton(this, width / 2, height * 0.88, "Go", () => {
      speak("Letter Lagoon is coming soon!");
    });
  }
}
