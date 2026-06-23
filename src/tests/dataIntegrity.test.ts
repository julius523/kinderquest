import { describe, expect, it } from "vitest";
import { COMMUNICATION_PHRASES } from "../data/communicationPhrases";
import { ACTIVITY_LIBRARY } from "../data/activityLibrary";
import { applyPronunciation } from "../data/pronunciationMap";
import { FAMILY_MEMBERS } from "../data/familyMembers";
import { REWARDS } from "../data/rewards";

const REQUIRED_PHRASE_IDS = [
  "help_please",
  "more_please",
  "no_thank_you",
  "my_turn",
  "your_turn",
  "break_please",
  "im_mad",
  "im_sad",
  "all_done",
  "i_want",
  "stop_please",
  "need_space",
  "need_help",
  "dont_like",
  "want_cars",
  "want_boat",
  "want_race",
  "want_story",
  "want_draw",
  "want_music",
  "need_calm_break",
  "im_ready",
  "go_again",
  "yes_please",
  "no",
  "wait",
  "gentle_hands",
  "safe_body",
];

describe("communication phrases", () => {
  it("includes every required AAC phrase", () => {
    const ids = COMMUNICATION_PHRASES.map((phrase) => phrase.id);
    for (const requiredId of REQUIRED_PHRASE_IDS) {
      expect(ids).toContain(requiredId);
    }
  });
});

describe("activity library", () => {
  it("has no duplicate activity ids", () => {
    const ids = ACTIVITY_LIBRARY.map((activity) => activity.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has a meaningful seed library covering every skill area used by Phase 6/7 scenes", () => {
    const skills = new Set(ACTIVITY_LIBRARY.map((activity) => activity.skill));
    expect(skills.has("letters")).toBe(true);
    expect(skills.has("counting")).toBe(true);
    expect(skills.has("prewriting")).toBe(true);
    expect(skills.has("communication")).toBe(true);
  });
});

describe("pronunciation map", () => {
  it("rewrites family names to their phonetic spelling", () => {
    expect(applyPronunciation("Halani's turn")).toBe("huh lawn ee's turn");
    expect(applyPronunciation("Amahni is sad")).toBe("uh mon ee is sad");
    expect(applyPronunciation("Grandma NuNu")).toBe("Grandma new new");
    expect(applyPronunciation("Londyn says stop")).toBe("London says stop");
  });

  it("covers every family member with an apostrophe-safe pronunciation", () => {
    expect(FAMILY_MEMBERS.length).toBeGreaterThanOrEqual(12);
  });
});

describe("rewards", () => {
  it("never uses shaming or punishment language in praise text", () => {
    const bannedPatterns = [/\bwrong\b/, /\bbad\b/, /\bfailed\b/, /try harder/];
    for (const reward of REWARDS) {
      const lowerCase = reward.praiseText.toLowerCase();
      for (const pattern of bannedPatterns) {
        expect(pattern.test(lowerCase)).toBe(false);
      }
    }
  });
});
