import Phaser from "phaser";
import { speak } from "../../services/textToSpeechService";
import { providePrompt } from "../../services/promptEngine";
import { finishActivity } from "../../services/activityEngine";
import { createBigButton } from "../systems/uiFactory";
import { celebrate, popIn, shake } from "../systems/feedback";
import type { ActivityDefinition } from "../../types/activity";

const OBJECT_TEXTURES: Record<string, string> = {
  race_car: "tex_car_plain",
  boat: "tex_boat",
  wheel: "tex_wheel",
  trophy: "tex_trophy",
};

export class NumberSpeedwayScene extends Phaser.Scene {
  private activity!: ActivityDefinition;
  private tappedCount = 0;
  private attempts = 0;
  private promptLevelUsed: ReturnType<typeof providePrompt>["level"] = "independent";

  constructor() {
    super("NumberSpeedwayScene");
  }

  create(data: { activity: ActivityDefinition }): void {
    this.activity = data.activity;
    this.tappedCount = 0;
    this.attempts = 0;
    this.cameras.main.setBackgroundColor("#fff7ed");

    const { width, height } = this.scale;
    const targetCount = this.activity.targetCount ?? 3;
    const textureKey = OBJECT_TEXTURES[this.activity.objectType ?? "race_car"] ?? "tex_car_plain";

    this.add
      .text(width / 2, height * 0.1, this.activity.instruction, {
        fontFamily: "system-ui, sans-serif",
        fontSize: "26px",
        fontStyle: "bold",
        color: "#9a3412",
        align: "center",
        wordWrap: { width: width * 0.85 },
      })
      .setOrigin(0.5);

    speak(this.activity.spokenInstruction);

    const counterText = this.add
      .text(width / 2, height * 0.22, "0", {
        fontFamily: "system-ui, sans-serif",
        fontSize: "40px",
        fontStyle: "bold",
        color: "#ea580c",
      })
      .setOrigin(0.5);

    const columns = Math.min(targetCount, 5);
    const cellWidth = (width * 0.8) / columns;
    const startX = width * 0.1 + cellWidth / 2;
    const rowHeight = 110;
    const startY = height * 0.38;

    for (let i = 0; i < targetCount; i++) {
      const col = i % columns;
      const row = Math.floor(i / columns);
      const x = startX + col * cellWidth;
      const y = startY + row * rowHeight;

      const image = this.add.image(x, y, textureKey).setTint(0xea580c).setInteractive({
        useHandCursor: true,
      });
      popIn(this, image, i * 70, 1.1);

      image.on("pointerdown", () => {
        if (image.getData("tapped")) return;
        image.setData("tapped", true);
        image.setTint(0x16a34a);
        celebrate(this, image);
        this.tappedCount += 1;
        speak(String(this.tappedCount));
        counterText.setText(String(this.tappedCount));

        if (this.tappedCount === targetCount) {
          this.time.delayedCall(400, () => this.askTotal());
        }
      });
    }
  }

  private askTotal(): void {
    const { width, height } = this.scale;
    const targetCount = this.activity.targetCount ?? 3;
    const options = Phaser.Utils.Array.Shuffle([
      targetCount,
      Math.max(1, targetCount - 1),
      targetCount + 1,
    ]);

    speak("How many did we count?");
    this.add
      .text(width / 2, height * 0.68, "How many did we count?", {
        fontFamily: "system-ui, sans-serif",
        fontSize: "24px",
        fontStyle: "bold",
        color: "#9a3412",
      })
      .setOrigin(0.5);

    const spacing = width / (options.length + 1);
    let correctButton: Phaser.GameObjects.Container | undefined;

    options.forEach((option, index) => {
      const button = createBigButton(
        this,
        spacing * (index + 1),
        height * 0.82,
        String(option),
        () => this.handleAnswer(option, targetCount, button, correctButton),
        { width: 100, height: 90, color: 0xea580c, entranceDelay: index * 90 },
      );
      if (option === targetCount) correctButton = button;
    });
  }

  private handleAnswer(
    answer: number,
    targetCount: number,
    tappedButton: Phaser.GameObjects.Container,
    correctButton: Phaser.GameObjects.Container | undefined,
  ): void {
    this.attempts += 1;

    if (answer === targetCount) {
      celebrate(this, tappedButton);
      void this.complete(1);
      return;
    }

    shake(this, tappedButton);

    const prompt = providePrompt(this.activity, this.attempts);
    this.promptLevelUsed = prompt.level;
    speak(prompt.spokenHint);

    if ((prompt.level === "visual" || prompt.level === "model") && correctButton) {
      this.tweens.add({ targets: correctButton, alpha: 0.35, yoyo: true, repeat: 3, duration: 180 });
    }
  }

  private async complete(correctAttempts: number): Promise<void> {
    const childProfileId = this.registry.get("childProfileId") as number;
    const sessionId = this.registry.get("sessionId") as number;

    const { reward } = await finishActivity({
      childProfileId,
      sessionId,
      activity: this.activity,
      attempts: Math.max(this.attempts, 1),
      correctAttempts,
      promptLevelUsed: this.promptLevelUsed,
      responseMode: "tap",
    });

    this.scene.start("RewardRaceScene", { reward });
  }
}
