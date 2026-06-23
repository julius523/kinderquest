import Phaser from "phaser";
import { speak } from "../../services/textToSpeechService";
import { listenForPhrase } from "../../services/speechRecognitionService";
import { finishActivity } from "../../services/activityEngine";
import { createBigButton } from "../systems/uiFactory";
import type { ActivityDefinition } from "../../types/activity";

export class SpeechGarageScene extends Phaser.Scene {
  private activity!: ActivityDefinition;
  private attempts = 0;
  private statusText!: Phaser.GameObjects.Text;

  constructor() {
    super("SpeechGarageScene");
  }

  create(data: { activity: ActivityDefinition }): void {
    this.activity = data.activity;
    this.attempts = 0;
    this.cameras.main.setBackgroundColor("#fff1f2");

    const { width, height } = this.scale;
    const targetPhrase = this.activity.targetPhrase ?? "help please";

    this.add
      .text(width / 2, height * 0.14, this.activity.instruction, {
        fontFamily: "system-ui, sans-serif",
        fontSize: "28px",
        fontStyle: "bold",
        color: "#9f1239",
        align: "center",
        wordWrap: { width: width * 0.85 },
      })
      .setOrigin(0.5);

    speak(this.activity.spokenInstruction);

    this.statusText = this.add
      .text(width / 2, height * 0.32, "", {
        fontFamily: "system-ui, sans-serif",
        fontSize: "20px",
        color: "#be123c",
        align: "center",
        wordWrap: { width: width * 0.8 },
      })
      .setOrigin(0.5);

    createBigButton(
      this,
      width / 2,
      height * 0.48,
      "Try voice",
      () => void this.tryVoice(targetPhrase),
      { color: 0xe11d48, width: 220 },
    );

    createBigButton(
      this,
      width / 2,
      height * 0.62,
      "I said it",
      () => void this.complete("parent_confirmed", 1),
      { color: 0x16a34a, width: 220 },
    );

    createBigButton(
      this,
      width / 2,
      height * 0.76,
      `Tap: ${targetPhrase}`,
      () => {
        speak(targetPhrase);
        void this.complete("tap", 1);
      },
      { color: 0x6366f1, width: 280, fontSize: "20px" },
    );
  }

  private async tryVoice(targetPhrase: string): Promise<void> {
    this.attempts += 1;
    this.statusText.setText("Listening…");
    speak(`Say: ${targetPhrase}`);

    const result = await listenForPhrase(targetPhrase);

    if (result.status === "matched") {
      this.statusText.setText("Great talking!");
      void this.complete("voice", 1);
      return;
    }

    if (result.status === "uncertain" || result.status === "attempted") {
      this.statusText.setText("Good trying. Let's say it together.");
      speak("Good trying. Let's say it together.");
      return;
    }

    this.statusText.setText("Voice isn't available — tap the phrase instead.");
  }

  private async complete(
    responseMode: "voice" | "tap" | "parent_confirmed",
    correctAttempts: number,
  ): Promise<void> {
    const childProfileId = this.registry.get("childProfileId") as number;
    const sessionId = this.registry.get("sessionId") as number;

    const { reward } = await finishActivity({
      childProfileId,
      sessionId,
      activity: this.activity,
      attempts: Math.max(this.attempts, 1),
      correctAttempts,
      promptLevelUsed: "independent",
      responseMode,
    });

    this.scene.start("RewardRaceScene", { reward });
  }
}
