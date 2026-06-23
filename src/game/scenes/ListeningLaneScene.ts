import Phaser from "phaser";
import { speak } from "../../services/textToSpeechService";
import { providePrompt } from "../../services/promptEngine";
import { finishActivity } from "../../services/activityEngine";
import { createBigButton } from "../systems/uiFactory";
import type { ActivityDefinition } from "../../types/activity";

const OBJECT_TEXTURES: Record<string, string> = {
  car: "tex_car",
  boat: "tex_boat",
};

export class ListeningLaneScene extends Phaser.Scene {
  private activity!: ActivityDefinition;
  private sequenceIndex = 0;
  private attempts = 0;
  private promptLevelUsed: ReturnType<typeof providePrompt>["level"] = "independent";

  constructor() {
    super("ListeningLaneScene");
  }

  create(data: { activity: ActivityDefinition }): void {
    this.activity = data.activity;
    this.sequenceIndex = 0;
    this.attempts = 0;
    this.cameras.main.setBackgroundColor("#eff6ff");

    const { width, height } = this.scale;
    const objects = this.activity.objects ?? this.activity.sequence ?? ["car"];

    this.add
      .text(width / 2, height * 0.12, this.activity.instruction, {
        fontFamily: "system-ui, sans-serif",
        fontSize: "26px",
        fontStyle: "bold",
        color: "#1e3a8a",
        align: "center",
        wordWrap: { width: width * 0.85 },
      })
      .setOrigin(0.5);

    speak(this.activity.spokenInstruction);

    const spacing = width / (objects.length + 1);

    objects.forEach((objectId, index) => {
      const textureKey = OBJECT_TEXTURES[objectId] ?? "tex_car";
      const image = this.add
        .image(spacing * (index + 1), height * 0.5, textureKey)
        .setScale(1.8)
        .setTint(0x2563eb)
        .setInteractive({ useHandCursor: true });

      image.on("pointerdown", () => this.handleTap(objectId, image));
    });

    createBigButton(this, width / 2, height * 0.88, "Repeat", () => {
      speak(this.activity.spokenInstruction);
    });
  }

  private handleTap(objectId: string, image: Phaser.GameObjects.Image): void {
    const sequence = this.activity.sequence ?? [];
    const expected = sequence[this.sequenceIndex];

    if (objectId === expected) {
      image.setTint(0x16a34a);
      this.sequenceIndex += 1;
      speak("Good listening.");

      if (this.sequenceIndex === sequence.length) {
        void this.complete();
      }
      return;
    }

    this.attempts += 1;
    const prompt = providePrompt(this.activity, this.attempts);
    this.promptLevelUsed = prompt.level;
    speak("Listen again.");
    speak(this.activity.spokenInstruction);
  }

  private async complete(): Promise<void> {
    const childProfileId = this.registry.get("childProfileId") as number;
    const sessionId = this.registry.get("sessionId") as number;

    const { reward } = await finishActivity({
      childProfileId,
      sessionId,
      activity: this.activity,
      attempts: Math.max(this.attempts + 1, 1),
      correctAttempts: 1,
      promptLevelUsed: this.promptLevelUsed,
      responseMode: "tap",
    });

    this.scene.start("RewardRaceScene", { reward });
  }
}
