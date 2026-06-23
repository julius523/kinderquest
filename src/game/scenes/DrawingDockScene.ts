import Phaser from "phaser";
import { speak } from "../../services/textToSpeechService";
import { providePrompt } from "../../services/promptEngine";
import { finishActivity } from "../../services/activityEngine";
import { createBigButton } from "../systems/uiFactory";
import { scoreTracingPath, type TracePoint } from "../systems/pathScoring";
import type { ActivityDefinition } from "../../types/activity";

const PASS_THRESHOLD = 0.6;

export class DrawingDockScene extends Phaser.Scene {
  private activity!: ActivityDefinition;
  private path: TracePoint[] = [];
  private drawing = false;
  private attempts = 0;
  private freehand!: Phaser.GameObjects.Graphics;

  constructor() {
    super("DrawingDockScene");
  }

  create(data: { activity: ActivityDefinition }): void {
    this.activity = data.activity;
    this.path = [];
    this.attempts = 0;
    this.cameras.main.setBackgroundColor("#fdf4ff");

    const { width, height } = this.scale;

    this.add
      .text(width / 2, height * 0.1, this.activity.instruction, {
        fontFamily: "system-ui, sans-serif",
        fontSize: "26px",
        fontStyle: "bold",
        color: "#7e22ce",
        align: "center",
        wordWrap: { width: width * 0.85 },
      })
      .setOrigin(0.5);

    speak(this.activity.spokenInstruction);
    this.drawTargetGuide();

    this.freehand = this.add.graphics();

    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      this.drawing = true;
      this.path = [{ x: pointer.x, y: pointer.y }];
    });

    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      if (!this.drawing) return;
      this.path.push({ x: pointer.x, y: pointer.y });
      this.redrawFreehand();
    });

    this.input.on("pointerup", () => {
      if (!this.drawing) return;
      this.drawing = false;
      void this.evaluate();
    });

    createBigButton(
      this,
      width / 2,
      height * 0.92,
      "Clear",
      () => {
        this.path = [];
        this.redrawFreehand();
      },
      { width: 140, height: 56, color: 0x94a3b8, fontSize: "18px" },
    );
  }

  private drawTargetGuide(): void {
    const { width, height } = this.scale;
    const guide = this.add.graphics();
    guide.lineStyle(4, 0xe9d5ff, 1);

    const cx = width / 2;
    const cy = height * 0.5;
    const size = 100;

    switch (this.activity.targetForm) {
      case "vertical_line":
        guide.lineBetween(cx, cy - size, cx, cy + size);
        break;
      case "horizontal_line":
        guide.lineBetween(cx - size, cy, cx + size, cy);
        break;
      case "diagonal_line":
        guide.lineBetween(cx - size, cy + size, cx + size, cy - size);
        break;
      case "circle":
        guide.strokeCircle(cx, cy, size * 0.8);
        break;
      case "cross":
        guide.lineBetween(cx, cy - size, cx, cy + size);
        guide.lineBetween(cx - size, cy, cx + size, cy);
        break;
      case "x_shape":
        guide.lineBetween(cx - size, cy - size, cx + size, cy + size);
        guide.lineBetween(cx - size, cy + size, cx + size, cy - size);
        break;
      case "zigzag":
        guide.beginPath();
        guide.moveTo(cx - size, cy + size * 0.6);
        guide.lineTo(cx - size * 0.3, cy - size * 0.6);
        guide.lineTo(cx + size * 0.3, cy + size * 0.6);
        guide.lineTo(cx + size, cy - size * 0.6);
        guide.strokePath();
        break;
      default:
        guide.strokeCircle(cx, cy, size * 0.8);
    }
  }

  private redrawFreehand(): void {
    this.freehand.clear();
    this.freehand.lineStyle(8, 0x7e22ce, 1);
    if (this.path.length < 2) return;

    this.freehand.beginPath();
    this.freehand.moveTo(this.path[0].x, this.path[0].y);
    for (const point of this.path.slice(1)) {
      this.freehand.lineTo(point.x, point.y);
    }
    this.freehand.strokePath();
  }

  private async evaluate(): Promise<void> {
    this.attempts += 1;
    const score = scoreTracingPath(this.path, this.activity.targetForm ?? "circle", {
      width: 200,
      height: 200,
    });

    if (score >= PASS_THRESHOLD) {
      const childProfileId = this.registry.get("childProfileId") as number;
      const sessionId = this.registry.get("sessionId") as number;

      const { reward } = await finishActivity({
        childProfileId,
        sessionId,
        activity: this.activity,
        attempts: this.attempts,
        correctAttempts: 1,
        promptLevelUsed: this.attempts === 1 ? "independent" : "visual",
        responseMode: "tap",
      });

      this.scene.start("RewardRaceScene", { reward });
      return;
    }

    const prompt = providePrompt(this.activity, this.attempts);
    speak(prompt.level === "caregiver" ? prompt.spokenHint : "Good try. Watch the road again.");
    this.path = [];
    this.redrawFreehand();
  }
}
