import Phaser from "phaser";
import { runChoiceActivity } from "../systems/runChoiceActivity";
import type { ActivityDefinition } from "../../types/activity";

const COLOR_HEX: Record<string, number> = {
  red: 0xef4444,
  blue: 0x3b82f6,
  yellow: 0xfacc15,
  green: 0x22c55e,
  orange: 0xf97316,
  purple: 0xa855f7,
};

export class ColorCityScene extends Phaser.Scene {
  constructor() {
    super("ColorCityScene");
  }

  create(data: { activity: ActivityDefinition }): void {
    this.cameras.main.setBackgroundColor("#fdf2f8");

    const choices = data.activity.choices ?? [];
    const colors = choices.map((choice) => {
      const colorWord = Object.keys(COLOR_HEX).find((word) => choice.includes(word));
      return colorWord ? COLOR_HEX[colorWord] : 0x94a3b8;
    });

    runChoiceActivity(this, data.activity, colors);
  }
}
