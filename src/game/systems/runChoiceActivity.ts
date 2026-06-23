import Phaser from "phaser";
import { speak } from "../../services/textToSpeechService";
import { providePrompt } from "../../services/promptEngine";
import { finishActivity } from "../../services/activityEngine";
import { createBigButton } from "./uiFactory";
import type { ActivityDefinition } from "../../types/activity";

/**
 * Shared interaction for any "tap the right choice" activity (letters,
 * shapes, colors): renders N choice buttons, evaluates taps against
 * correctAnswer, escalates through the prompt hierarchy on misses, and
 * hands off to RewardRaceScene on success. Letter Lagoon, Shape Harbor, and
 * Color City are otherwise identical, so this is the one place that logic
 * lives.
 */
export type RunChoiceActivityOptions = {
  /** Fires once, synchronously, the moment a correct answer is tapped —
   * before the async save/reward lookup resolves. Lets callers (e.g. the
   * Monster Racer Challenge) layer on their own flourish. */
  onCorrect?: () => void;
};

export function runChoiceActivity(
  scene: Phaser.Scene,
  activity: ActivityDefinition,
  buttonColors?: number[],
  options: RunChoiceActivityOptions = {},
): void {
  const { width, height } = scene.scale;
  const choices = activity.choices ?? [];

  let attempts = 0;
  let correctAttempts = 0;
  let promptLevelUsed = providePrompt(activity, 0).level;

  scene.add
    .text(width / 2, height * 0.12, activity.instruction, {
      fontFamily: "system-ui, sans-serif",
      fontSize: "28px",
      fontStyle: "bold",
      color: "#334155",
      align: "center",
      wordWrap: { width: width * 0.85 },
    })
    .setOrigin(0.5);

  speak(activity.spokenInstruction);

  const buttons: Phaser.GameObjects.Container[] = [];
  const spacing = width / (choices.length + 1);

  choices.forEach((choice, index) => {
    const button = createBigButton(
      scene,
      spacing * (index + 1),
      height * 0.5,
      choice,
      () => handleChoice(choice),
      { width: Math.min(160, spacing - 16), height: 110, color: buttonColors?.[index] ?? 0xff5a36 },
    );
    buttons.push(button);
  });

  function highlightCorrectChoice(): void {
    const correctIndex = choices.indexOf(String(activity.correctAnswer));
    const target = buttons[correctIndex];
    if (!target) return;
    scene.tweens.add({ targets: target, alpha: 0.35, yoyo: true, repeat: 3, duration: 180 });
  }

  function handleChoice(choice: string): void {
    attempts += 1;
    const isCorrect = choice === activity.correctAnswer;

    if (isCorrect) {
      correctAttempts += 1;
      options.onCorrect?.();
      void complete();
      return;
    }

    const prompt = providePrompt(activity, attempts);
    promptLevelUsed = prompt.level;
    speak(prompt.spokenHint);

    if (prompt.level === "visual" || prompt.level === "model") {
      highlightCorrectChoice();
    }
  }

  async function complete(): Promise<void> {
    const childProfileId = scene.registry.get("childProfileId") as number;
    const sessionId = scene.registry.get("sessionId") as number;

    const { reward } = await finishActivity({
      childProfileId,
      sessionId,
      activity,
      attempts,
      correctAttempts,
      promptLevelUsed,
      responseMode: "tap",
    });

    scene.scene.start("RewardRaceScene", { reward });
  }
}
