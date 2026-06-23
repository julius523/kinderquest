import { getActivitiesBySkill } from "../data/activityLibrary";
import { getRecentActivityResults, getAllInterests } from "../db/repositories/activityRepo";
import { observeChildState } from "./engagementEngine";
import type { ActivityDefinition } from "../types/activity";
import type { ChildState } from "../types/analytics";
import type { SkillName } from "../types/game";

export type NextStepDecision =
  | { type: "calm_break" }
  | { type: "movement_break" }
  | { type: "activity"; activity: ActivityDefinition };

const RECENT_WINDOW = 5;

/**
 * The session-flow decision: given the child's recent state, should we
 * interrupt with a calm break or movement break before continuing, or go
 * ahead with the requested learning activity? This never blocks the child
 * indefinitely — it just decides what plays next.
 */
export function decideNextStep(state: ChildState, skill: SkillName): NextStepDecision | { type: "skill"; skill: SkillName } {
  if (state.frustrationMarkers >= 2 || state.regulationState === "dysregulated") {
    return { type: "calm_break" };
  }

  if (state.rapidTapBursts >= 3 || state.regulationState === "playful_high_energy") {
    return { type: "movement_break" };
  }

  return { type: "skill", skill };
}

/** Weighted-random pick favoring activities tagged with the child's
 * higher-scored interests, so cars/boats/superheroes show up more once
 * they've proven engaging — without ever fully excluding other activities. */
export function pickAdaptiveActivity(
  skill: SkillName,
  interestScores: Record<string, number>,
): ActivityDefinition | undefined {
  const candidates = getActivitiesBySkill(skill);
  if (candidates.length === 0) return undefined;

  const weighted = candidates.map((activity) => {
    const interestBoost = (activity.interests ?? []).reduce(
      (sum, tag) => sum + Math.max(interestScores[tag] ?? 0, 0),
      0,
    );
    return { activity, weight: 1 + interestBoost };
  });

  const totalWeight = weighted.reduce((sum, entry) => sum + entry.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const entry of weighted) {
    if (roll < entry.weight) return entry.activity;
    roll -= entry.weight;
  }

  return weighted[weighted.length - 1].activity;
}

/**
 * The full async decision used by the game: looks at the child's last few
 * activity results, decides whether a calm/movement break is needed first,
 * and otherwise picks an interest-weighted activity for the requested
 * skill.
 */
export async function chooseNextStep(
  childProfileId: number,
  skill: SkillName,
): Promise<NextStepDecision> {
  const recentResults = await getRecentActivityResults(childProfileId, RECENT_WINDOW);
  const state = observeChildState(recentResults);
  const decision = decideNextStep(state, skill);

  if (decision.type !== "skill") {
    return decision;
  }

  const interestRecords = await getAllInterests(childProfileId);
  const interestScores = Object.fromEntries(interestRecords.map((record) => [record.tag, record.score]));
  const activity = pickAdaptiveActivity(decision.skill, interestScores);

  if (!activity) {
    return { type: "movement_break" };
  }

  return { type: "activity", activity };
}
