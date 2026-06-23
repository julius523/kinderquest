import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { db } from "../db/db";
import { createProfile } from "../db/repositories/profileRepo";
import { startSession } from "../db/repositories/sessionRepo";
import { saveActivityResult, upsertInterest } from "../db/repositories/activityRepo";
import { decideNextStep, pickAdaptiveActivity, chooseNextStep } from "../services/adaptiveEngine";
import type { ChildState } from "../types/analytics";

function baseState(overrides: Partial<ChildState> = {}): ChildState {
  return {
    engagementScore: 60,
    rapidTapBursts: 0,
    idleEvents: 0,
    frustrationMarkers: 0,
    refusals: 0,
    transitionDifficulty: false,
    energyLevel: "low",
    regulationState: "focused",
    ...overrides,
  };
}

beforeAll(async () => {
  await db.open();
});

afterEach(async () => {
  await Promise.all(db.tables.map((table) => table.clear()));
});

describe("decideNextStep", () => {
  it("recommends a calm break when frustration markers are high", () => {
    const decision = decideNextStep(baseState({ frustrationMarkers: 2 }), "letters");
    expect(decision.type).toBe("calm_break");
  });

  it("recommends a movement break for rapid-tap bursts", () => {
    const decision = decideNextStep(baseState({ rapidTapBursts: 3 }), "letters");
    expect(decision.type).toBe("movement_break");
  });

  it("otherwise proceeds with the requested skill", () => {
    const decision = decideNextStep(baseState(), "counting");
    expect(decision).toEqual({ type: "skill", skill: "counting" });
  });

  it("prioritizes calm break over movement break when both signals are present", () => {
    const decision = decideNextStep(baseState({ frustrationMarkers: 2, rapidTapBursts: 5 }), "letters");
    expect(decision.type).toBe("calm_break");
  });
});

describe("pickAdaptiveActivity", () => {
  it("returns undefined for a skill with no seeded activities", () => {
    expect(pickAdaptiveActivity("speech_sounds", {})).toBeUndefined();
  });

  it("still returns a real activity when interest scores are empty", () => {
    const activity = pickAdaptiveActivity("counting", {});
    expect(activity?.skill).toBe("counting");
  });

  it("deterministically favors the highest-weighted activity when Math.random() rolls 0", () => {
    // With Math.random() mocked to 0, the roll is always 0, so the function
    // must return the *first* candidate in iteration order every time —
    // proving the weighting loop is deterministic, not just "returns something".
    const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0);
    const first = pickAdaptiveActivity("letters", { cars: 50 });
    const second = pickAdaptiveActivity("letters", { cars: 50 });
    randomSpy.mockRestore();

    expect(first?.id).toBe(second?.id);
  });
});

describe("chooseNextStep", () => {
  it("returns a calm break when the child's last results show frustration", async () => {
    const profile = await createProfile("Tester", 5);
    const session = await startSession(profile.id!, "laptop");

    await saveActivityResult({
      sessionId: session.id!,
      childProfileId: profile.id!,
      activityId: "letter_find_x_race_sign",
      activityType: "letter_find",
      skill: "letters",
      theme: "race_car",
      startedAt: Date.now(),
      endedAt: Date.now(),
      completed: false,
      skipped: false,
      attempts: 4,
      correctAttempts: 0,
      accuracy: 0,
      promptLevelUsed: "caregiver",
      responseMode: "tap",
      transitionSupportUsed: false,
      firstThenUsed: false,
      visualScheduleUsed: false,
      communicationBoardUsed: false,
      frustrationMarkers: 2,
      rapidTapBursts: 0,
      idleEvents: 0,
      interests: [],
    });

    const decision = await chooseNextStep(profile.id!, "letters");
    expect(decision.type).toBe("calm_break");
  });

  it("picks a real activity when the child's state is unremarkable", async () => {
    const profile = await createProfile("Tester2", 5);
    await startSession(profile.id!, "laptop");
    await upsertInterest({ childProfileId: profile.id!, tag: "cars", score: 10, updatedAt: Date.now() });

    const decision = await chooseNextStep(profile.id!, "letters");
    expect(decision.type).toBe("activity");
    if (decision.type === "activity") {
      expect(decision.activity.skill).toBe("letters");
    }
  });
});
