import { describe, expect, it } from "vitest";
import { calculateEngagementScore, observeChildState } from "../services/engagementEngine";
import type { ActivityResult } from "../types/activity";

function baseResult(overrides: Partial<ActivityResult> = {}): ActivityResult {
  return {
    sessionId: 1,
    childProfileId: 1,
    activityId: "test",
    activityType: "letter_find",
    skill: "letters",
    theme: "race_car",
    startedAt: Date.now(),
    endedAt: Date.now(),
    completed: true,
    skipped: false,
    attempts: 1,
    correctAttempts: 1,
    accuracy: 1,
    promptLevelUsed: "independent",
    responseMode: "tap",
    transitionSupportUsed: false,
    firstThenUsed: false,
    visualScheduleUsed: false,
    communicationBoardUsed: false,
    frustrationMarkers: 0,
    rapidTapBursts: 0,
    idleEvents: 0,
    interests: [],
    ...overrides,
  };
}

describe("calculateEngagementScore", () => {
  it("starts at 50 with no recent results", () => {
    expect(calculateEngagementScore([])).toBe(50);
  });

  it("rewards independent completions with high accuracy", () => {
    const score = calculateEngagementScore([baseResult(), baseResult(), baseResult()]);
    expect(score).toBeGreaterThan(50);
  });

  it("penalizes frustration markers heavily", () => {
    const score = calculateEngagementScore([baseResult({ frustrationMarkers: 2, completed: false, accuracy: 0 })]);
    expect(score).toBeLessThan(50);
  });

  it("clamps to the 0-100 range", () => {
    const manyFrustrated = Array.from({ length: 10 }, () =>
      baseResult({ frustrationMarkers: 3, completed: false, accuracy: 0 }),
    );
    expect(calculateEngagementScore(manyFrustrated)).toBe(0);

    const manyGreat = Array.from({ length: 20 }, () => baseResult());
    expect(calculateEngagementScore(manyGreat)).toBe(100);
  });

  it("factors in parent rating", () => {
    const low = calculateEngagementScore([baseResult()], 1);
    const high = calculateEngagementScore([baseResult()], 5);
    expect(high).toBeGreaterThan(low);
  });
});

describe("observeChildState", () => {
  it("infers dysregulated when frustration markers pile up", () => {
    const state = observeChildState([baseResult({ frustrationMarkers: 2, completed: false })]);
    expect(state.regulationState).toBe("dysregulated");
  });

  it("infers playful_high_energy from rapid tap bursts", () => {
    const state = observeChildState([baseResult({ rapidTapBursts: 4 })]);
    expect(state.regulationState).toBe("playful_high_energy");
    expect(state.energyLevel).toBe("high");
  });

  it("infers needs_transition_support from caregiver-level transition attempts", () => {
    const state = observeChildState([
      baseResult({ skill: "transitions", promptLevelUsed: "caregiver" }),
    ]);
    expect(state.regulationState).toBe("needs_transition_support");
    expect(state.transitionDifficulty).toBe(true);
  });

  it("infers focused for an unremarkable recent window", () => {
    const state = observeChildState([baseResult({ accuracy: 0.7, promptLevelUsed: "verbal" })]);
    expect(state.regulationState).toBe("focused");
  });
});
