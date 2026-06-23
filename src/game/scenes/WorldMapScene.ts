import Phaser from "phaser";
import { speak } from "../../services/textToSpeechService";
import { createBigButton } from "../systems/uiFactory";
import { pickRandomActivity } from "../../data/activityLibrary";
import type { SkillName } from "../../types/game";

type WorldNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  unlocked: boolean;
  sceneKey?: string;
  skill?: SkillName;
};

const WORLD_NODES: WorldNode[] = [
  { id: "welcome_garage", label: "Garage", x: 0.06, y: 0.55, unlocked: true },
  {
    id: "letter_lagoon",
    label: "Letter Lagoon",
    x: 0.2,
    y: 0.3,
    unlocked: true,
    sceneKey: "LetterLagoonScene",
    skill: "letters",
  },
  {
    id: "number_speedway",
    label: "Number Speedway",
    x: 0.34,
    y: 0.6,
    unlocked: true,
    sceneKey: "NumberSpeedwayScene",
    skill: "counting",
  },
  {
    id: "shape_harbor",
    label: "Shape Harbor",
    x: 0.48,
    y: 0.3,
    unlocked: true,
    sceneKey: "ShapeHarborScene",
    skill: "shapes",
  },
  {
    id: "color_city",
    label: "Color City",
    x: 0.62,
    y: 0.6,
    unlocked: true,
    sceneKey: "ColorCityScene",
    skill: "colors",
  },
  {
    id: "listening_lane",
    label: "Listening Lane",
    x: 0.76,
    y: 0.3,
    unlocked: true,
    sceneKey: "ListeningLaneScene",
    skill: "listening",
  },
  {
    id: "drawing_dock",
    label: "Drawing Dock",
    x: 0.9,
    y: 0.6,
    unlocked: true,
    sceneKey: "DrawingDockScene",
    skill: "prewriting",
  },
];

/** The Kinder Quest Road: a big path map showing every mission, locked
 * future worlds, and trophy progress. Selecting a node + pressing Go
 * launches that world's scene with a freshly picked activity. */
export class WorldMapScene extends Phaser.Scene {
  private selectedNodeId = "letter_lagoon";

  constructor() {
    super("WorldMapScene");
  }

  create(): void {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor("#e0f2fe");

    this.add
      .text(width / 2, height * 0.08, "Kinder Quest Road", {
        fontFamily: "system-ui, sans-serif",
        fontSize: "32px",
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
    for (const point of points.slice(1)) path.lineTo(point.x, point.y);
    path.strokePath();

    const circles: Phaser.GameObjects.Arc[] = [];

    const refreshHighlights = () => {
      WORLD_NODES.forEach((node, index) => {
        const circle = circles[index];
        const isSelected = node.id === this.selectedNodeId;
        circle.setStrokeStyle(4, isSelected ? 0xff5a36 : node.unlocked ? 0x0ea5e9 : 0x94a3b8);
        circle.setScale(isSelected ? 1.15 : 1);
      });
    };

    WORLD_NODES.forEach((node, index) => {
      const { x, y } = points[index];
      const circle = this.add.circle(x, y, 32, node.unlocked ? 0xffffff : 0xcbd5e1);
      circles.push(circle);

      this.add
        .text(x, y + 48, node.label, {
          fontFamily: "system-ui, sans-serif",
          fontSize: "14px",
          fontStyle: node.unlocked ? "bold" : "normal",
          color: node.unlocked ? "#334155" : "#94a3b8",
        })
        .setOrigin(0.5);

      if (node.unlocked && node.sceneKey) {
        circle.setInteractive({ useHandCursor: true });
        circle.on("pointerdown", () => {
          speak(node.label);
          this.selectedNodeId = node.id;
          refreshHighlights();
        });
      }
    });

    refreshHighlights();

    createBigButton(this, width / 2, height * 0.88, "Go", () => {
      this.goToSelectedWorld();
    });
  }

  private goToSelectedWorld(): void {
    const node = WORLD_NODES.find((candidate) => candidate.id === this.selectedNodeId);
    if (!node?.sceneKey || !node.skill) return;

    const activity = pickRandomActivity(node.skill);
    if (!activity) {
      speak(`${node.label} is coming soon!`);
      return;
    }

    this.scene.start(node.sceneKey, { activity });
  }
}
