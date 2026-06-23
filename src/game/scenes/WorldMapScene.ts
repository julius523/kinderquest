import Phaser from "phaser";
import { speak } from "../../services/textToSpeechService";
import { createBigButton } from "../systems/uiFactory";
import { chooseNextStep } from "../../services/adaptiveEngine";
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
  { id: "welcome_garage", label: "Garage", x: 0.05, y: 0.6, unlocked: true },
  {
    id: "letter_lagoon",
    label: "Letter Lagoon",
    x: 0.175,
    y: 0.38,
    unlocked: true,
    sceneKey: "LetterLagoonScene",
    skill: "letters",
  },
  {
    id: "number_speedway",
    label: "Number Speedway",
    x: 0.3,
    y: 0.6,
    unlocked: true,
    sceneKey: "NumberSpeedwayScene",
    skill: "counting",
  },
  {
    id: "shape_harbor",
    label: "Shape Harbor",
    x: 0.425,
    y: 0.38,
    unlocked: true,
    sceneKey: "ShapeHarborScene",
    skill: "shapes",
  },
  {
    id: "color_city",
    label: "Color City",
    x: 0.55,
    y: 0.6,
    unlocked: true,
    sceneKey: "ColorCityScene",
    skill: "colors",
  },
  {
    id: "listening_lane",
    label: "Listening Lane",
    x: 0.675,
    y: 0.38,
    unlocked: true,
    sceneKey: "ListeningLaneScene",
    skill: "listening",
  },
  {
    id: "drawing_dock",
    label: "Drawing Dock",
    x: 0.8,
    y: 0.6,
    unlocked: true,
    sceneKey: "DrawingDockScene",
    skill: "prewriting",
  },
  {
    id: "sight_words",
    label: "Sight Words",
    x: 0.925,
    y: 0.38,
    unlocked: true,
    sceneKey: "SightWordsScene",
    skill: "sight_words",
  },
];

type SupportMission = {
  id: string;
  label: string;
  icon: string;
  color: number;
  launch: (scene: Phaser.Scene) => void;
};

const SUPPORT_MISSIONS: SupportMission[] = [
  {
    id: "speech_garage",
    label: "Speech Garage",
    icon: "message-circle",
    color: 0xe11d48,
    launch: (scene) => {
      const activity = pickRandomActivity("communication");
      if (activity) scene.scene.start("SpeechGarageScene", { activity });
    },
  },
  {
    id: "story_cove",
    label: "Story Cove",
    icon: "book-open",
    color: 0x0284c7,
    launch: (scene) => scene.scene.start("StoryCoveScene", {}),
  },
  {
    id: "calm_pit_stop",
    label: "Calm Pit Stop",
    icon: "wind",
    color: 0x6366f1,
    launch: (scene) => scene.scene.start("CalmPitStopScene", {}),
  },
  {
    id: "movement_break",
    label: "Movement Break",
    icon: "activity",
    color: 0xeab308,
    launch: (scene) => scene.scene.start("MovementMissionScene", {}),
  },
  {
    id: "monster_racer",
    label: "Monster Racer",
    icon: "car",
    color: 0xb45309,
    launch: (scene) => scene.scene.start("MonsterRacerChallengeScene"),
  },
];

/** The Kinder Quest Road: a real-looking road (asphalt + dashed center
 * line) winding through a sunny outdoor scene, showing every mission and
 * locked future worlds. Selecting a node + pressing Go launches that
 * world's scene with a freshly picked activity. A second row of support
 * missions (speech, story, calm, movement, Monster Racer) is always
 * available — these aren't gated behind path progress. */
export class WorldMapScene extends Phaser.Scene {
  private selectedNodeId = "letter_lagoon";

  constructor() {
    super("WorldMapScene");
  }

  create(): void {
    const { width, height } = this.scale;

    this.drawScenery(width, height);

    this.add
      .text(width / 2, height * 0.06, "Kinder Quest Road", {
        fontFamily: "system-ui, sans-serif",
        fontSize: "30px",
        fontStyle: "bold",
        color: "#ffffff",
        stroke: "#0369a1",
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    speak("Here is the road. Pick a mission!");

    createBigButton(
      this,
      width * 0.1,
      height * 0.06,
      "Goodbye",
      () => this.scene.start("GoodbyeScene"),
      { width: 110, height: 48, color: 0x94a3b8, fontSize: "14px" },
    );

    createBigButton(
      this,
      width * 0.9,
      height * 0.06,
      "Flash Cards",
      () => this.scene.start("FlashCardHubScene"),
      { width: 130, height: 48, color: 0x9333ea, fontSize: "14px" },
    );

    const points = WORLD_NODES.map((node) => ({ x: width * node.x, y: height * node.y }));
    this.drawRoad(points);

    const circles: Phaser.GameObjects.Arc[] = [];

    const refreshHighlights = () => {
      WORLD_NODES.forEach((node, index) => {
        const circle = circles[index];
        const isSelected = node.id === this.selectedNodeId;
        circle.setStrokeStyle(5, isSelected ? 0xff5a36 : node.unlocked ? 0x0ea5e9 : 0x94a3b8);
        circle.setScale(isSelected ? 1.15 : 1);
      });
    };

    WORLD_NODES.forEach((node, index) => {
      const { x, y } = points[index];
      const circle = this.add.circle(x, y, 30, node.unlocked ? 0xffffff : 0xcbd5e1);
      circles.push(circle);

      this.add
        .text(x, y + 44, node.label, {
          fontFamily: "system-ui, sans-serif",
          fontSize: "13px",
          fontStyle: "bold",
          color: "#ffffff",
          stroke: node.unlocked ? "#0369a1" : "#64748b",
          strokeThickness: 4,
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

    createBigButton(this, width / 2, height * 0.82, "Go", () => {
      this.goToSelectedWorld();
    });

    this.drawSupportRow(width, height);
  }

  private drawSupportRow(width: number, height: number): void {
    const spacing = width / (SUPPORT_MISSIONS.length + 1);
    const y = height * 0.93;

    SUPPORT_MISSIONS.forEach((mission, index) => {
      createBigButton(
        this,
        spacing * (index + 1),
        y,
        mission.label,
        () => mission.launch(this),
        { width: spacing - 10, height: 56, color: mission.color, fontSize: "12px" },
      );
    });
  }

  private drawScenery(width: number, height: number): void {
    const horizonY = height * 0.7;

    const sky = this.add.graphics();
    sky.fillGradientStyle(0x7dd3fc, 0x7dd3fc, 0xe0f2fe, 0xe0f2fe, 1);
    sky.fillRect(0, 0, width, horizonY);

    const grass = this.add.graphics();
    grass.fillStyle(0x86efac, 1);
    grass.fillRect(0, horizonY, width, height - horizonY);

    this.add.image(width * 0.88, height * 0.1, "tex_sun").setScale(1.1);
    this.add.image(width * 0.12, height * 0.08, "tex_cloud").setScale(0.9).setAlpha(0.9);
    this.add.image(width * 0.78, height * 0.16, "tex_cloud").setScale(0.7).setAlpha(0.85);

    const bushPositions = [0.04, 0.96];
    bushPositions.forEach((fx) => {
      this.add.image(width * fx, horizonY + 8, "tex_bush").setScale(0.7).setTint(0x4ade80);
    });
  }

  private drawRoad(points: { x: number; y: number }[]): void {
    const road = this.add.graphics();
    road.lineStyle(40, 0x475569, 1);
    road.beginPath();
    road.moveTo(points[0].x, points[0].y);
    for (const point of points.slice(1)) road.lineTo(point.x, point.y);
    road.strokePath();

    // Re-stroke each joint as a thick circle so corners look paved, not pointy.
    for (const point of points) {
      road.fillStyle(0x475569, 1);
      road.fillCircle(point.x, point.y, 20);
    }

    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i];
      const b = points[i + 1];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const segmentLength = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx);
      const dashLength = 16;
      const gapLength = 14;
      const step = dashLength + gapLength;

      for (let d = step / 2; d < segmentLength - step / 2; d += step) {
        const cx = a.x + Math.cos(angle) * d;
        const cy = a.y + Math.sin(angle) * d;
        const rect = this.add.rectangle(cx, cy, dashLength, 4, 0xfde047);
        rect.setRotation(angle);
      }
    }
  }

  private goToSelectedWorld(): void {
    const node = WORLD_NODES.find((candidate) => candidate.id === this.selectedNodeId);
    if (!node?.sceneKey || !node.skill) return;
    void this.launchWorld(node.sceneKey, node.skill, node.label);
  }

  private async launchWorld(sceneKey: string, skill: SkillName, label: string): Promise<void> {
    const childProfileId = this.registry.get("childProfileId") as number | undefined;

    if (!childProfileId) {
      speak(`${label} is coming soon!`);
      return;
    }

    const decision = await chooseNextStep(childProfileId, skill);

    if (decision.type === "calm_break") {
      this.scene.start("CalmPitStopScene", { returnScene: "WorldMapScene" });
      return;
    }

    if (decision.type === "movement_break") {
      this.scene.start("MovementMissionScene", { returnScene: "WorldMapScene" });
      return;
    }

    this.scene.start(sceneKey, { activity: decision.activity });
  }
}
