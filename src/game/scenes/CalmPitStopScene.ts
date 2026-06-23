import Phaser from "phaser";
import { speak } from "../../services/textToSpeechService";
import { createBigButton } from "../systems/uiFactory";
import { logBehaviorEvent } from "../../db/repositories/analyticsRepo";
import { getSession, updateSession } from "../../db/repositories/sessionRepo";
import { CALM_STRATEGIES } from "../../data/calmStrategies";

export class CalmPitStopScene extends Phaser.Scene {
  private returnScene?: string;

  constructor() {
    super("CalmPitStopScene");
  }

  create(data: { returnScene?: string }): void {
    this.returnScene = data.returnScene;
    this.cameras.main.setBackgroundColor("#eef2ff");
    speak("Pit stop. Let's help your body feel safe.");
    this.showChoices();
  }

  private showChoices(): void {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height * 0.12, "Pit stop. Let's help your body feel safe.", {
        fontFamily: "system-ui, sans-serif",
        fontSize: "24px",
        fontStyle: "bold",
        color: "#3730a3",
        align: "center",
        wordWrap: { width: width * 0.85 },
      })
      .setOrigin(0.5);

    const columns = 2;
    const spacingX = width / (columns + 1);
    const spacingY = 130;
    const startY = height * 0.3;

    CALM_STRATEGIES.forEach((strategy, index) => {
      const col = index % columns;
      const row = Math.floor(index / columns);
      createBigButton(
        this,
        spacingX * (col + 1),
        startY + row * spacingY,
        strategy.label,
        () => this.runStrategy(strategy.spokenInstruction),
        { width: 220, height: 80, color: 0x6366f1, fontSize: "18px" },
      );
    });
  }

  private runStrategy(spokenInstruction: string): void {
    this.children.removeAll();
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor("#eef2ff");

    speak(spokenInstruction);
    this.add
      .text(width / 2, height * 0.35, spokenInstruction, {
        fontFamily: "system-ui, sans-serif",
        fontSize: "26px",
        fontStyle: "bold",
        color: "#3730a3",
        align: "center",
        wordWrap: { width: width * 0.8 },
      })
      .setOrigin(0.5);

    this.time.delayedCall(2500, () => this.askReady());
  }

  private askReady(): void {
    this.children.removeAll();
    const { width, height } = this.scale;

    speak("Are you ready, or do you need more break?");
    this.add
      .text(width / 2, height * 0.3, "Are you ready, or need more break?", {
        fontFamily: "system-ui, sans-serif",
        fontSize: "24px",
        fontStyle: "bold",
        color: "#3730a3",
        align: "center",
        wordWrap: { width: width * 0.8 },
      })
      .setOrigin(0.5);

    createBigButton(
      this,
      width / 2 - 130,
      height * 0.55,
      "I'm ready",
      () => void this.handleReady(),
      { color: 0x22c55e, width: 180 },
    );

    createBigButton(
      this,
      width / 2 + 130,
      height * 0.55,
      "More break",
      () => {
        this.children.removeAll();
        this.cameras.main.setBackgroundColor("#eef2ff");
        this.showChoices();
      },
      { color: 0x94a3b8, width: 180 },
    );
  }

  private async handleReady(): Promise<void> {
    const sessionId = this.registry.get("sessionId") as number | undefined;

    if (sessionId) {
      await logBehaviorEvent({
        sessionId,
        eventType: "calm_break_used",
        intensity: 1,
        timestamp: Date.now(),
      });
      const session = await getSession(sessionId);
      if (session) {
        await updateSession(sessionId, {
          regulationSummary: {
            ...session.regulationSummary,
            calmBreaksUsed: session.regulationSummary.calmBreaksUsed + 1,
          },
        });
      }
    }

    speak("Nice calming.");
    this.scene.start(this.returnScene ?? "WorldMapScene");
  }
}
