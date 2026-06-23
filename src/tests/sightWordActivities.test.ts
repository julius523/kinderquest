import { describe, expect, it } from "vitest";
import { generateSightWordActivities, getActivitiesBySkill, ACTIVITY_LIBRARY } from "../data/activityLibrary";
import { SIGHT_WORDS } from "../data/flashCardDecks";

describe("generateSightWordActivities", () => {
  it("creates one choice-based activity per sight word, with the word as the correct answer", () => {
    const activities = generateSightWordActivities(SIGHT_WORDS);
    expect(activities).toHaveLength(SIGHT_WORDS.length);

    for (const activity of activities) {
      expect(activity.skill).toBe("sight_words");
      expect(activity.type).toBe("sight_word_find");
      expect(activity.choices).toContain(activity.correctAnswer);
      expect(activity.choices).toHaveLength(3);
    }
  });

  it("never includes the target word itself as a distractor", () => {
    const activities = generateSightWordActivities(SIGHT_WORDS);
    for (const activity of activities) {
      const distractors = activity.choices!.filter((c) => c !== activity.correctAnswer);
      expect(distractors).not.toContain(activity.correctAnswer);
      expect(new Set(activity.choices)).toEqual(new Set(activity.choices));
    }
  });

  it("is included in the main ACTIVITY_LIBRARY under the sight_words skill", () => {
    const sightWordActivities = getActivitiesBySkill("sight_words");
    expect(sightWordActivities.length).toBe(SIGHT_WORDS.length);
    expect(sightWordActivities.every((a) => ACTIVITY_LIBRARY.includes(a))).toBe(true);
  });
});
