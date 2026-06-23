import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildActivityResultsCsv, exportActivityResultsAsCsv, exportProgressAsJson } from "../services/exportService";
import { createEmptySession } from "../types/activity";
import type { ActivityResult } from "../types/activity";

function result(overrides: Partial<ActivityResult> = {}): ActivityResult {
  return {
    sessionId: 1,
    childProfileId: 1,
    activityId: "letter_find_x_race_sign",
    activityType: "letter_find",
    skill: "letters",
    theme: "race_car",
    startedAt: 1700000000000,
    endedAt: 1700000001000,
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

describe("buildActivityResultsCsv", () => {
  it("includes a header row and one row per result", () => {
    const csv = buildActivityResultsCsv([result(), result({ activityId: "count_3_race_car", skill: "counting" })]);
    const lines = csv.split("\n");
    expect(lines).toHaveLength(3);
    expect(lines[0]).toBe(
      "activity,skill,started_at,completed,attempts,correct_attempts,accuracy,prompt_level,response_mode",
    );
    expect(lines[1]).toContain("letter_find_x_race_sign");
    expect(lines[2]).toContain("count_3_race_car");
  });

  it("escapes values containing commas or quotes", () => {
    const csv = buildActivityResultsCsv([result({ activityId: 'tricky, "name"' })]);
    expect(csv).toContain('"tricky, ""name"""');
  });

  it("returns just a header row for an empty result set", () => {
    const csv = buildActivityResultsCsv([]);
    expect(csv.split("\n")).toHaveLength(1);
  });
});

describe("download triggers", () => {
  beforeEach(() => {
    vi.stubGlobal("URL", {
      ...URL,
      createObjectURL: vi.fn(() => "blob:mock"),
      revokeObjectURL: vi.fn(),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("exportActivityResultsAsCsv creates and revokes a blob URL without throwing", () => {
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    expect(() => exportActivityResultsAsCsv([result()], "Super Racer")).not.toThrow();
    expect(clickSpy).toHaveBeenCalled();
  });

  it("exportProgressAsJson creates and revokes a blob URL without throwing", () => {
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    const session = createEmptySession(1, "laptop");
    expect(() => exportProgressAsJson("Super Racer", [session], [result()])).not.toThrow();
    expect(clickSpy).toHaveBeenCalled();
  });
});
