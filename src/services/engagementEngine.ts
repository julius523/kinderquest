import { clamp } from "../utils/clamp";
import type { ActivityResult } from "../types/activity";
import type { ChildState } from "../types/analytics";
import type { RegulationState } from "../types/game";

export function calculateEngagementScore(
  recentResults: ActivityResult[],
  parentRating?: 1 | 2 | 3 | 4 | 5,
): number {
  let score = 50;

  for (const result of recentResults) {
    if (result.completed) score += 6;
    if (result.accuracy >= 0.8) score += 4;
    if (result.promptLevelUsed === "independent") score += 3;
    if (result.promptLevelUsed === "visual") score += 1;
    if (result.transitionSupportUsed && result.completed) score += 2;

    score -= result.frustrationMarkers * 8;
    score -= result.rapidTapBursts * 4;
    score -= result.idleEvents * 5;
    if (result.skipped) score -= 6;
  }

  if (parentRating) {
    score += (parentRating - 3) * 5;
  }

  return clamp(score, 0, 100);
}

function inferRegulationState(input: {
  engagementScore: number;
  rapidTapBursts: number;
  idleEvents: number;
  frustrationMarkers: number;
  refusals: number;
  transitionDifficulty: boolean;
}): RegulationState {
  if (input.frustrationMarkers >= 2) return "dysregulated";
  if (input.frustrationMarkers === 1) return "frustrated";
  if (input.rapidTapBursts >= 3) return "playful_high_energy";
  if (input.transitionDifficulty) return "needs_transition_support";
  if (input.idleEvents >= 2) return "bored";
  if (input.engagementScore > 80) return "ready_for_challenge";
  if (input.engagementScore < 45) return "needs_caregiver_prompt";
  return "focused";
}

/** Summarizes a short recent window of activity results into the child's
 * current state, used to decide what should happen next in the session. */
export function observeChildState(
  recentResults: ActivityResult[],
  parentRating?: 1 | 2 | 3 | 4 | 5,
): ChildState {
  const engagementScore = calculateEngagementScore(recentResults, parentRating);
  const rapidTapBursts = recentResults.reduce((sum, r) => sum + r.rapidTapBursts, 0);
  const idleEvents = recentResults.reduce((sum, r) => sum + r.idleEvents, 0);
  const frustrationMarkers = recentResults.reduce((sum, r) => sum + r.frustrationMarkers, 0);
  const refusals = recentResults.filter((r) => r.skipped).length;
  const transitionDifficulty = recentResults.some(
    (r) => r.skill === "transitions" && r.promptLevelUsed === "caregiver",
  );

  const energyLevel: ChildState["energyLevel"] =
    rapidTapBursts >= 3 ? "high" : rapidTapBursts >= 1 ? "medium" : "low";

  return {
    engagementScore,
    rapidTapBursts,
    idleEvents,
    frustrationMarkers,
    refusals,
    transitionDifficulty,
    energyLevel,
    regulationState: inferRegulationState({
      engagementScore,
      rapidTapBursts,
      idleEvents,
      frustrationMarkers,
      refusals,
      transitionDifficulty,
    }),
  };
}
