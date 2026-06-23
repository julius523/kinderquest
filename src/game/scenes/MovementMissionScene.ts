import Phaser from "phaser";
import { speak } from "../../services/textToSpeechService";
import { createBigButton } from "../systems/uiFactory";
import { logBehaviorEvent } from "../../db/repositories/analyticsRepo";
import { getSession, updateSession } from "../../db/repositories/sessionRepo";
import { MOVEMENT_BREAKS, type MovementBreak } from "../../data/movementBreaks";

export class MovementMissionScene extends Phaser.Scene {
  constructor() {
    super("MovementMissionScene");
  }

  create(data: { movement?: MovementBreak; returnScene?: string }): void {
    const movement =
      data.movement ?? MOVEMENT_BREAKS[Math.floor(Math.random() * MOVEMENT_BREAKS.length)];
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor("#fefce8");

    speak(movement.spokenInstruction);

    const icon = this.add.image(width / 2, height * 0.35, "tex_star").setScale(3).setTint(0xeab308);
    this.tweens.add({
      targets: icon,
      angle: { from: -15, to: 15 },
      yoyo: true,
      repeat: -1,
      duration: 500,
    });

    this.add
      .text(width / 2, height * 0.55, movement.label, {
        fontFamily: "system-ui, sans-serif",
        fontSize: "26px",
        fontStyle: "bold",
        color: "#854d0e",
      })
      .setOrigin(0.5);

    const counterText = this.add
      .text(width / 2, height * 0.65, String(movement.durationSeconds), {
        fontFamily: "system-ui, sans-serif",
        fontSize: "36px",
        fontStyle: "bold",
        color: "#ca8a04",
      })
      .setOrigin(0.5);

    let secondsLeft = movement.durationSeconds;
    this.time.addEvent({
      delay: 1000,
      repeat: movement.durationSeconds - 1,
      callback: () => {
        secondsLeft -= 1;
        counterText.setText(String(Math.max(secondsLeft, 0)));
      },
    });

    createBigButton(
      this,
      width / 2,
      height * 0.85,
      "I did it!",
      () => {
        void this.handleDone(data.returnScene);
      },
      { color: 0x22c55e },
    );
  }

  private async handleDone(returnScene?: string): Promise<void> {
    const sessionId = this.registry.get("sessionId") as number | undefined;

    if (sessionId) {
      await logBehaviorEvent({ sessionId, eventType: "movement_break_used", intensity: 1, timestamp: Date.now() });
      const session = await getSession(sessionId);
      if (session) {
        await updateSession(sessionId, {
          regulationSummary: {
            ...session.regulationSummary,
            movementBreaksUsed: session.regulationSummary.movementBreaksUsed + 1,
          },
        });
      }
    }

    speak("Nice moving, Super Racer!");
    this.scene.start(returnScene ?? "WorldMapScene");
  }
}
