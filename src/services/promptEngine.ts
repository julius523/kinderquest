import type { ActivityDefinition } from "../types/activity";
import type { PromptLevel } from "../types/game";

export type PromptResult = {
  level: PromptLevel;
  spokenHint: string;
};

/**
 * Least-intrusive-support-first prompt hierarchy: visual -> verbal -> model
 * -> caregiver. The app never prompts hand-over-hand itself — past the
 * model step it only ever offers to bring a grown-up in.
 */
export function providePrompt(activity: ActivityDefinition, attemptCount: number): PromptResult {
  if (attemptCount <= 1) {
    return { level: "visual", spokenHint: "Look carefully. Try again." };
  }
  if (attemptCount === 2) {
    return { level: "verbal", spokenHint: activity.verbalHint ?? "Try one more time." };
  }
  if (attemptCount === 3) {
    return { level: "model", spokenHint: "Watch me. Now you try." };
  }
  return { level: "caregiver", spokenHint: "Grown-up can help." };
}
