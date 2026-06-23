import { describe, expect, it } from "vitest";
import {
  getVisualSchedulePrintable,
  getFirstThenCardPrintable,
  getCommunicationBoardPrintable,
  getCalmChoiceBoardPrintable,
  getTurnTakingCardsPrintable,
  getRewardChartPrintable,
  getHomePracticeSheetPrintable,
  getTeacherSummaryPrintable,
} from "../services/printableService";
import { COMMUNICATION_PHRASES } from "../data/communicationPhrases";
import { REWARDS } from "../data/rewards";

describe("printableService", () => {
  it("builds a visual schedule with every default schedule step", () => {
    const doc = getVisualSchedulePrintable();
    expect(doc.sections[0].items).toContain("Hello");
    expect(doc.sections[0].items).toContain("Goodbye");
  });

  it("builds a first/then card with distinct First and Then sections", () => {
    const doc = getFirstThenCardPrintable("Trace 3 lines", "Race Super Racer");
    expect(doc.sections.find((s) => s.heading === "First")?.items).toEqual(["Trace 3 lines"]);
    expect(doc.sections.find((s) => s.heading === "Then")?.items).toEqual(["Race Super Racer"]);
  });

  it("includes every required AAC phrase in the printable communication board", () => {
    const doc = getCommunicationBoardPrintable();
    expect(doc.sections[0].items).toHaveLength(COMMUNICATION_PHRASES.length);
    expect(doc.sections[0].items).toContain("help please");
  });

  it("lists every calm strategy", () => {
    const doc = getCalmChoiceBoardPrintable();
    expect(doc.sections[0].items.length).toBeGreaterThan(0);
  });

  it("lists every family member for turn-taking cards", () => {
    const doc = getTurnTakingCardsPrintable();
    expect(doc.sections[0].items).toContain("Halani");
  });

  it("splits the reward chart into unlocked vs still-to-unlock", () => {
    const oneUnlocked = [REWARDS[0].id];
    const doc = getRewardChartPrintable(oneUnlocked);
    const unlocked = doc.sections.find((s) => s.heading === "Unlocked")!;
    const remaining = doc.sections.find((s) => s.heading === "Still to Unlock")!;

    expect(unlocked.items).toEqual([REWARDS[0].name]);
    expect(remaining.items).not.toContain(REWARDS[0].name);
    expect(unlocked.items.length + remaining.items.length).toBe(REWARDS.length);
  });

  it("always returns at least one home practice idea", () => {
    const doc = getHomePracticeSheetPrintable();
    expect(doc.sections[0].items.length).toBeGreaterThan(0);
  });

  it("builds a teacher summary scoped to the given child's skill levels and insights", () => {
    const doc = getTeacherSummaryPrintable(
      "Super Racer",
      [{ skill: "letters", level: 2, successStreak: 1, supportNeeded: 0 }],
      [
        { childProfileId: 1, type: "what_worked", title: "x", message: "Cars helped", createdAt: 0 },
        { childProfileId: 1, type: "why", title: "y", message: "Visual cues", createdAt: 0 },
      ],
    );

    expect(doc.title).toContain("Super Racer");
    expect(doc.sections.find((s) => s.heading === "Skill Levels")?.items[0]).toContain("letters");
    expect(doc.sections.find((s) => s.heading === "What's Working")?.items).toEqual(["Cars helped"]);
    expect(doc.sections.find((s) => s.heading === "Suggested Classroom Strategies")?.items).toEqual([
      "Visual cues",
    ]);
  });
});
