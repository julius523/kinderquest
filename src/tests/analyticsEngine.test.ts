import { describe, expect, it } from "vitest";
import { computeSessionSummary, summarizeSkillProgress } from "../services/analyticsEngine";
import { createEmptySession } from "../types/activity";
import type { ActivityResult } from "../types/activity";

function result(skill: ActivityResult["skill"], accuracy: number, completed: boolean): ActivityResult {
  return {
    sessionId: 1,
    childProfileId: 1,
    activityId: "x",
    activityType: "letter_find",
    skill,
    theme: "race_car",
    startedAt: Date.now(),
    endedAt: Date.now(),
    completed,
    skipped: false,
    attempts: 1,
    correctAttempts: completed ? 1 : 0,
    accuracy,
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
  };
}

describe("computeSessionSummary", () => {
  it("identifies the best and hardest skill by average accuracy", () => {
    const session = createEmptySession(1, "laptop");
    session.startedAt = Date.now() - 5 * 60_000;
    session.endedAt = Date.now();

    const results = [
      result("letters", 1, true),
      result("letters", 0.9, true),
      result("counting", 0.2, false),
      result("counting", 0.1, false),
    ];

    const summary = computeSessionSummary(session, results);

    expect(summary.bestSkill).toBe("letters");
    expect(summary.hardestSkill).toBe("counting");
    expect(summary.activitiesAttempted).toBe(4);
    expect(summary.activitiesCompleted).toBe(2);
    expect(summary.minutesPlayed).toBeCloseTo(5, 0);
  });

  it("handles a session with no activity results yet", () => {
    const session = createEmptySession(1, "phone");
    const summary = computeSessionSummary(session, []);
    expect(summary.bestSkill).toBeUndefined();
    expect(summary.activitiesAttempted).toBe(0);
  });
});

describe("summarizeSkillProgress", () => {
  it("sorts skill progress alphabetically by skill name", () => {
    const summary = summarizeSkillProgress([
      { id: 1, childProfileId: 1, skill: "letters", level: 2, successStreak: 1, supportNeeded: 0, updatedAt: 0 },
      { id: 2, childProfileId: 1, skill: "counting", level: 1, successStreak: 0, supportNeeded: 1, updatedAt: 0 },
    ]);

    expect(summary.map((s) => s.skill)).toEqual(["counting", "letters"]);
  });
});
