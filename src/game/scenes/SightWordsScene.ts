import Phaser from "phaser";
import { runChoiceActivity } from "../systems/runChoiceActivity";
import type { ActivityDefinition } from "../../types/activity";

export class SightWordsScene extends Phaser.Scene {
  constructor() {
    super("SightWordsScene");
  }

  create(data: { activity: ActivityDefinition }): void {
    this.cameras.main.setBackgroundColor("#fdf2f8");
    runChoiceActivity(this, data.activity, [0xdb2777, 0xec4899, 0xf472b6]);
  }
}
