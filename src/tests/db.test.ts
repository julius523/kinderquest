import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { db } from "../db/db";
import { createProfile, getOrCreateDefaultProfile, updateProfile } from "../db/repositories/profileRepo";
import { getSettings, updateSettings } from "../db/repositories/settingsRepo";
import { startSession, endSession, getSessionsForChild } from "../db/repositories/sessionRepo";
import {
  saveActivityResult,
  getActivityResultsForSession,
  upsertSkillProgress,
  getSkillProgress,
} from "../db/repositories/activityRepo";
import { ensureSeeded } from "../db/seed";

beforeAll(async () => {
  await db.open();
});

afterEach(async () => {
  await Promise.all(db.tables.map((table) => table.clear()));
});

describe("profileRepo", () => {
  it("creates and reuses the default child profile", async () => {
    const first = await getOrCreateDefaultProfile("Super Racer", 5);
    const second = await getOrCreateDefaultProfile("Someone Else", 4);
    expect(second.id).toBe(first.id);
    expect(second.name).toBe("Super Racer");
  });

  it("never creates two profiles when called concurrently (e.g. App's seed effect racing a page's own load effect)", async () => {
    const [first, second] = await Promise.all([
      getOrCreateDefaultProfile("Super Racer", 5),
      getOrCreateDefaultProfile("Super Racer", 5),
    ]);
    expect(first.id).toBe(second.id);

    const all = await db.childProfiles.toArray();
    expect(all).toHaveLength(1);
  });

  it("updates a profile and bumps updatedAt", async () => {
    const profile = await createProfile("Test Child", 4);
    const before = profile.updatedAt;
    await new Promise((resolve) => setTimeout(resolve, 5));
    await updateProfile(profile.id!, { name: "Updated Name" });
    const updated = await db.childProfiles.get(profile.id!);
    expect(updated?.name).toBe("Updated Name");
    expect(updated!.updatedAt).toBeGreaterThan(before);
  });
});

describe("settingsRepo", () => {
  it("creates default settings once and persists updates", async () => {
    const settings = await getSettings();
    expect(settings.readAloudEnabled).toBe(true);
    expect(settings.youtubeEnabled).toBe(false);

    const updated = await updateSettings({ voiceVolume: 0.5 });
    expect(updated.voiceVolume).toBe(0.5);

    const reloaded = await getSettings();
    expect(reloaded.voiceVolume).toBe(0.5);
  });
});

describe("sessionRepo", () => {
  it("starts and ends a session for a child", async () => {
    const profile = await createProfile("Session Tester", 5);
    const session = await startSession(profile.id!, "phone");
    expect(session.id).toBeDefined();
    expect(session.engagementScore).toBe(50);

    await endSession(session.id!, { completedActivities: 2 });
    const sessions = await getSessionsForChild(profile.id!);
    expect(sessions).toHaveLength(1);
    expect(sessions[0].completedActivities).toBe(2);
    expect(sessions[0].endedAt).toBeDefined();
  });
});

describe("activityRepo", () => {
  it("saves activity results scoped to a session", async () => {
    const profile = await createProfile("Activity Tester", 5);
    const session = await startSession(profile.id!, "laptop");

    await saveActivityResult({
      sessionId: session.id!,
      childProfileId: profile.id!,
      activityId: "letter_find_x_race_sign",
      activityType: "letter_find",
      skill: "letters",
      theme: "race_car",
      startedAt: Date.now(),
      completed: true,
      skipped: false,
      attempts: 1,
      correctAttempts: 1,
      accuracy: 1,
      promptLevelUsed: "independent",
      responseMode: "tap",
      transitionSupportUsed: false,
      firstThenUsed: false,
      visualScheduleUsed: true,
      communicationBoardUsed: false,
      frustrationMarkers: 0,
      rapidTapBursts: 0,
      idleEvents: 0,
      interests: ["cars"],
    });

    const results = await getActivityResultsForSession(session.id!);
    expect(results).toHaveLength(1);
    expect(results[0].skill).toBe("letters");
  });

  it("tracks skill progress per child", async () => {
    const profile = await createProfile("Skill Tester", 5);
    await upsertSkillProgress({
      childProfileId: profile.id!,
      skill: "counting",
      level: 1,
      successStreak: 2,
      supportNeeded: 0,
      updatedAt: Date.now(),
    });

    const progress = await getSkillProgress(profile.id!, "counting");
    expect(progress?.level).toBe(1);
    expect(progress?.successStreak).toBe(2);
  });
});

describe("seed", () => {
  it("ensures a profile and settings exist on first run", async () => {
    const { profile, settings } = await ensureSeeded("Super Racer", 5);
    expect(profile.id).toBeDefined();
    expect(settings.id).toBeDefined();
  });
});
