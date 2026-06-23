import Phaser from "phaser";
import { speak } from "../../services/textToSpeechService";
import { createBigButton } from "../systems/uiFactory";
import { prefersReducedMotion } from "../systems/motionPreference";
import type { Reward } from "../../types/rewards";

const CONFETTI_COLORS = [0xff5a36, 0xffd23f, 0x3bb2ff, 0x34d399, 0xa78bfa];

export class RewardRaceScene extends Phaser.Scene {
  constructor() {
    super("RewardRaceScene");
  }

  create(data: { reward: Reward; returnScene?: string }): void {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor("#fef9c3");

    const reduceMotion = prefersReducedMotion();
    if (!reduceMotion) this.spawnConfetti();

    const trophy = this.add.image(width / 2, height * 0.32, "tex_trophy").setScale(2.4).setTint(0xf59e0b);
    if (!reduceMotion) {
      this.tweens.add({
        targets: trophy,
        angle: { from: -8, to: 8 },
        yoyo: true,
        repeat: -1,
        duration: 500,
      });
    }

    this.add
      .text(width / 2, height * 0.52, data.reward.name, {
        fontFamily: "system-ui, sans-serif",
        fontSize: "30px",
        fontStyle: "bold",
        color: "#b45309",
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height * 0.62, data.reward.praiseText, {
        fontFamily: "system-ui, sans-serif",
        fontSize: "20px",
        color: "#78350f",
        align: "center",
        wordWrap: { width: width * 0.8 },
      })
      .setOrigin(0.5);

    speak(data.reward.praiseText);

    createBigButton(this, width / 2, height * 0.84, "Next", () => {
      this.scene.start(data.returnScene ?? "WorldMapScene");
    });
  }

  private spawnConfetti(): void {
    const { width, height } = this.scale;

    for (let i = 0; i < 18; i++) {
      const x = Phaser.Math.Between(0, width);
      const piece = this.add.rectangle(x, -20, 10, 10, CONFETTI_COLORS[i % CONFETTI_COLORS.length]);

      this.tweens.add({
        targets: piece,
        y: height + 20,
        angle: Phaser.Math.Between(180, 540),
        duration: Phaser.Math.Between(1200, 2200),
        delay: Phaser.Math.Between(0, 600),
        repeat: -1,
      });
    }
  }
}
