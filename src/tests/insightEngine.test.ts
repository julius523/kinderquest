import { describe, expect, it } from "vitest";
import { generateInsights } from "../services/insightEngine";
import type { ActivityResult } from "../types/activity";
import type { InterestTag } from "../types/game";

function result(overrides: Partial<ActivityResult>): ActivityResult {
  return {
    sessionId: 1,
    childProfileId: 1,
    activityId: "x",
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

describe("generateInsights", () => {
  it("returns no insights for an empty history", () => {
    expect(generateInsights(1, [])).toEqual([]);
  });

  it("flags an interest as a 'what worked' driver when it correlates with higher accuracy", () => {
    const carInterest: InterestTag[] = ["cars"];
    const results: ActivityResult[] = [
      result({ accuracy: 1, interests: carInterest }),
      result({ accuracy: 1, interests: carInterest }),
      result({ accuracy: 1, interests: carInterest }),
      result({ accuracy: 0.2, interests: [] }),
      result({ accuracy: 0.2, interests: [] }),
    ];

    const insights = generateInsights(1, results);
    const whatWorked = insights.find((i) => i.type === "what_worked" && i.title.includes("Cars"));
    expect(whatWorked).toBeDefined();
    expect(insights.some((i) => i.type === "why")).toBe(true);
  });

  it("does not fabricate an interest insight from too small a sample", () => {
    const results: ActivityResult[] = [result({ accuracy: 1, interests: ["cars"] })];
    const insights = generateInsights(1, results);
    expect(insights.some((i) => i.title.includes("Cars"))).toBe(false);
  });

  it("notes independent mastery when most attempts needed no prompting", () => {
    const results = Array.from({ length: 5 }, () => result({ promptLevelUsed: "independent" }));
    const insights = generateInsights(1, results);
    expect(insights.some((i) => i.title === "Working mostly independently")).toBe(true);
  });

  it("always includes a home-practice suggestion when there is any history", () => {
    const insights = generateInsights(1, [result({})]);
    expect(insights.some((i) => i.type === "home_practice")).toBe(true);
  });
});
