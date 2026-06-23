import Phaser from "phaser";
import { speak } from "../../services/textToSpeechService";
import { createBigButton } from "../systems/uiFactory";
import { endSession, getSession } from "../../db/repositories/sessionRepo";
import { getActivityResultsForSession } from "../../db/repositories/activityRepo";
import { computeSessionSummary } from "../../services/analyticsEngine";

/** Closes a session out with a recap instead of just vanishing back to
 * the home screen — what we did today, how many trophies, then goodbye. */
export class GoodbyeScene extends Phaser.Scene {
  constructor() {
    super("GoodbyeScene");
  }

  create(): void {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor("#fef3c7");

    this.add
      .text(width / 2, height * 0.15, "Great racing today!", {
        fontFamily: "system-ui, sans-serif",
        fontSize: "32px",
        fontStyle: "bold",
        color: "#b45309",
      })
      .setOrigin(0.5);

    const trophy = this.add.image(width / 2, height * 0.38, "tex_trophy").setScale(2.2).setTint(0xf59e0b);
    this.tweens.add({ targets: trophy, angle: { from: -6, to: 6 }, yoyo: true, repeat: -1, duration: 600 });

    const summaryText = this.add
      .text(width / 2, height * 0.58, "Saving your progress…", {
        fontFamily: "system-ui, sans-serif",
        fontSize: "20px",
        color: "#78350f",
        align: "center",
        wordWrap: { width: width * 0.8 },
      })
      .setOrigin(0.5);

    void this.wrapUpSession(summaryText);

    createBigButton(this, width / 2, height * 0.85, "Home", () => {
      const onExitToHome = this.registry.get("onExitToHome") as (() => void) | undefined;
      onExitToHome?.();
    });
  }

  private async wrapUpSession(summaryText: Phaser.GameObjects.Text): Promise<void> {
    const sessionId = this.registry.get("sessionId") as number | undefined;
    if (!sessionId) {
      summaryText.setText("See you next time!");
      speak("Great racing today! See you next time!");
      return;
    }

    await endSession(sessionId);
    const [session, results] = await Promise.all([
      getSession(sessionId),
      getActivityResultsForSession(sessionId),
    ]);

    if (!session) {
      summaryText.setText("See you next time!");
      speak("Great racing today! See you next time!");
      return;
    }

    const summary = computeSessionSummary(session, results);
    const message = `You completed ${summary.activitiesCompleted} ${
      summary.activitiesCompleted === 1 ? "mission" : "missions"
    } and earned ${summary.rewardsUnlockedCount} ${
      summary.rewardsUnlockedCount === 1 ? "reward" : "rewards"
    }. See you next time!`;

    summaryText.setText(message);
    speak(`Great racing today! ${message}`);
  }
}
