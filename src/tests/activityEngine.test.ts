import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { db } from "../db/db";
import { createProfile } from "../db/repositories/profileRepo";
import { startSession } from "../db/repositories/sessionRepo";
import { getActivityResultsForChild, getSkillProgress } from "../db/repositories/activityRepo";
import { finishActivity } from "../services/activityEngine";
import { getActivityById } from "../data/activityLibrary";

const letterActivity = getActivityById("letter_find_x_race_sign")!;

beforeAll(async () => {
  await db.open();
});

afterEach(async () => {
  await Promise.all(db.tables.map((table) => table.clear()));
});

describe("activityEngine.finishActivity", () => {
  it("saves a real result and unlocks the first available reward for the skill", async () => {
    const profile = await createProfile("Tester", 5);
    const session = await startSession(profile.id!, "laptop");

    const { reward, praiseText } = await finishActivity({
      childProfileId: profile.id!,
      sessionId: session.id!,
      activity: letterActivity,
      attempts: 1,
      correctAttempts: 1,
      promptLevelUsed: "independent",
      responseMode: "tap",
    });

    expect(reward.id).toBe("red_rocket_car");
    expect(praiseText).toBe(reward.praiseText);

    const results = await getActivityResultsForChild(profile.id!);
    expect(results).toHaveLength(1);
    expect(results[0].completed).toBe(true);
    expect(results[0].accuracy).toBe(1);
  });

  it("falls back to a repeatable praise reward once the skill's rewards are exhausted", async () => {
    const profile = await createProfile("Tester2", 5);
    const session = await startSession(profile.id!, "laptop");

    const first = await finishActivity({
      childProfileId: profile.id!,
      sessionId: session.id!,
      activity: letterActivity,
      attempts: 1,
      correctAttempts: 1,
      promptLevelUsed: "independent",
      responseMode: "tap",
    });
    expect(first.reward.id).toBe("red_rocket_car");

    const second = await finishActivity({
      childProfileId: profile.id!,
      sessionId: session.id!,
      activity: letterActivity,
      attempts: 1,
      correctAttempts: 1,
      promptLevelUsed: "independent",
      responseMode: "tap",
    });

    expect(second.reward.id).not.toBe("red_rocket_car");
    expect(second.reward.category).toBe("trophy");
  });

  it("builds a success streak and levels up the skill after 3 independent completions", async () => {
    const profile = await createProfile("Tester3", 5);
    const session = await startSession(profile.id!, "laptop");

    for (let i = 0; i < 3; i++) {
      await finishActivity({
        childProfileId: profile.id!,
        sessionId: session.id!,
        activity: letterActivity,
        attempts: 1,
        correctAttempts: 1,
        promptLevelUsed: "independent",
        responseMode: "tap",
      });
    }

    const progress = await getSkillProgress(profile.id!, "letters");
    expect(progress?.level).toBe(1);
    expect(progress?.successStreak).toBe(0);
  });

  it("does not build streak credit for caregiver-assisted completions", async () => {
    const profile = await createProfile("Tester4", 5);
    const session = await startSession(profile.id!, "laptop");

    await finishActivity({
      childProfileId: profile.id!,
      sessionId: session.id!,
      activity: letterActivity,
      attempts: 4,
      correctAttempts: 1,
      promptLevelUsed: "caregiver",
      responseMode: "tap",
    });

    const progress = await getSkillProgress(profile.id!, "letters");
    expect(progress?.successStreak).toBe(0);
    expect(progress?.supportNeeded).toBe(0);
  });
});
