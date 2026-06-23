import Phaser from "phaser";
import { runChoiceActivity } from "../systems/runChoiceActivity";
import type { ActivityDefinition } from "../../types/activity";

export class ShapeHarborScene extends Phaser.Scene {
  constructor() {
    super("ShapeHarborScene");
  }

  create(data: { activity: ActivityDefinition }): void {
    this.cameras.main.setBackgroundColor("#f0fdf4");
    const { width, height } = this.scale;

    this.add.image(width * 0.18, height * 0.85, "tex_boat").setScale(1.4).setTint(0x16a34a).setAlpha(0.5);

    runChoiceActivity(this, data.activity, [0x16a34a, 0x22c55e, 0x4ade80]);
  }
}
