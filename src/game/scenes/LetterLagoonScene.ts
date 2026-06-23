import Phaser from "phaser";
import { runChoiceActivity } from "../systems/runChoiceActivity";
import type { ActivityDefinition } from "../../types/activity";

export class LetterLagoonScene extends Phaser.Scene {
  constructor() {
    super("LetterLagoonScene");
  }

  create(data: { activity: ActivityDefinition }): void {
    this.cameras.main.setBackgroundColor("#ecfeff");
    const { width, height } = this.scale;

    this.add.image(width * 0.15, height * 0.85, "tex_boat").setScale(1.6).setTint(0x0891b2).setAlpha(0.5);
    this.add.image(width * 0.85, height * 0.88, "tex_boat").setScale(1.2).setTint(0x0e7490).setAlpha(0.4);

    runChoiceActivity(this, data.activity, [0x0891b2, 0x0ea5e9, 0x06b6d4]);
  }
}
