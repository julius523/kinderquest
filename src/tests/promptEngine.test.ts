import { describe, expect, it } from "vitest";
import { providePrompt } from "../services/promptEngine";
import { getActivityById } from "../data/activityLibrary";

const activity = getActivityById("letter_find_x_race_sign")!;

describe("promptEngine", () => {
  it("escalates from visual to verbal to model to caregiver", () => {
    expect(providePrompt(activity, 1).level).toBe("visual");
    expect(providePrompt(activity, 2).level).toBe("verbal");
    expect(providePrompt(activity, 3).level).toBe("model");
    expect(providePrompt(activity, 4).level).toBe("caregiver");
    expect(providePrompt(activity, 10).level).toBe("caregiver");
  });

  it("never escalates straight to caregiver help on the first miss", () => {
    expect(providePrompt(activity, 1).level).not.toBe("caregiver");
  });

  it("uses the activity's own verbal hint when provided", () => {
    const withHint = { ...activity, verbalHint: "Listen for the X sound." };
    expect(providePrompt(withHint, 2).spokenHint).toBe("Listen for the X sound.");
  });
});
