import type { ActivityResult } from "../types/activity";
import type { ParentInsight } from "../types/analytics";

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

const MIN_SAMPLE_SIZE = 3;
const ENGAGEMENT_LIFT_THRESHOLD = 0.15;

const HOME_PRACTICE_SUGGESTIONS = [
  "Use First/Then before cleanup: First clean up cars, then race one car.",
  "Count toy cars during play: one car, two cars, three cars.",
  "Practice 'help please' when opening snacks or toys.",
  "Practice 'no thank you' instead of screaming or pushing away.",
  "Draw roads, wheels, circles, and X roadblocks with chalk or crayons.",
  "Take turns racing cars with King, Halani, Londyn, or Amahni.",
  "Read a short story using silly voices and ask him to point to pictures.",
  "Use movement before sitting work: jump 5 times, then trace one line.",
];

function titleCaseInterest(tag: string): string {
  return tag
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Generates parent-facing insights from real activity history. Every
 * insight here is derived from actual data — if there isn't enough history
 * yet for a pattern to be meaningful, it's simply omitted rather than
 * guessed at.
 */
export function generateInsights(childProfileId: number, results: ActivityResult[]): ParentInsight[] {
  const insights: ParentInsight[] = [];
  const now = Date.now();
  const overallAccuracy = average(results.map((r) => r.accuracy));

  const byInterest = new Map<string, ActivityResult[]>();
  for (const result of results) {
    for (const tag of result.interests) {
      const list = byInterest.get(tag) ?? [];
      list.push(result);
      byInterest.set(tag, list);
    }
  }

  for (const [tag, group] of byInterest.entries()) {
    if (group.length < MIN_SAMPLE_SIZE) continue;
    const groupAccuracy = average(group.map((r) => r.accuracy));

    if (groupAccuracy > overallAccuracy + ENGAGEMENT_LIFT_THRESHOLD) {
      const label = titleCaseInterest(tag);
      insights.push({
        childProfileId,
        type: "what_worked",
        title: `${label} increased engagement`,
        message: `He completed activities more accurately when they used ${label.toLowerCase()}.`,
        createdAt: now,
      });
      insights.push({
        childProfileId,
        type: "why",
        title: "Interest-based motivation",
        message: `Preferred interests like ${label.toLowerCase()} can reduce refusal and increase attention. Try using it outside the app too.`,
        createdAt: now,
      });
    }
  }

  const promptable = results.filter((r) => r.attempts > 0);
  const independentRate =
    promptable.length > 0
      ? promptable.filter((r) => r.promptLevelUsed === "independent").length / promptable.length
      : 0;

  if (promptable.length >= MIN_SAMPLE_SIZE && independentRate >= 0.6) {
    insights.push({
      childProfileId,
      type: "what_worked",
      title: "Working mostly independently",
      message: "Most attempts needed no extra prompting — the current difficulty matches his skills well.",
      createdAt: now,
    });
  }

  const caregiverRate =
    promptable.length > 0
      ? promptable.filter((r) => r.promptLevelUsed === "caregiver").length / promptable.length
      : 0;

  if (promptable.length >= MIN_SAMPLE_SIZE && caregiverRate >= 0.4) {
    insights.push({
      childProfileId,
      type: "why",
      title: "Visual supports may help",
      message: "He's needed grown-up help often recently — visual cues may reduce the language load before that point.",
      createdAt: now,
    });
  }

  if (results.length > 0) {
    const suggestion = HOME_PRACTICE_SUGGESTIONS[Math.floor(Math.random() * HOME_PRACTICE_SUGGESTIONS.length)];
    insights.push({
      childProfileId,
      type: "home_practice",
      title: "Try outside the app",
      message: suggestion,
      createdAt: now,
    });
  }

  return insights;
}
