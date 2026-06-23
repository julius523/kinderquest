import { DEFAULT_SESSION_SCHEDULE } from "../data/visualSchedules";
import { COMMUNICATION_PHRASES } from "../data/communicationPhrases";
import { CALM_STRATEGIES } from "../data/calmStrategies";
import { FAMILY_MEMBERS } from "../data/familyMembers";
import { REWARDS } from "../data/rewards";
import type { SkillProgressSummary } from "./analyticsEngine";
import type { ParentInsight } from "../types/analytics";

export type PrintableSection = {
  heading?: string;
  items: string[];
};

export type PrintableDoc = {
  title: string;
  subtitle?: string;
  sections: PrintableSection[];
};

export function getVisualSchedulePrintable(): PrintableDoc {
  return {
    title: "Visual Schedule",
    subtitle: "Show this before and during a session.",
    sections: [{ items: DEFAULT_SESSION_SCHEDULE.map((item) => item.label) }],
  };
}

export function getFirstThenCardPrintable(firstText: string, thenText: string): PrintableDoc {
  return {
    title: "First / Then",
    sections: [
      { heading: "First", items: [firstText] },
      { heading: "Then", items: [thenText] },
    ],
  };
}

export function getCommunicationBoardPrintable(): PrintableDoc {
  return {
    title: "Communication Board",
    subtitle: "Point to a picture to help communicate.",
    sections: [{ items: COMMUNICATION_PHRASES.map((phrase) => phrase.text) }],
  };
}

export function getCalmChoiceBoardPrintable(): PrintableDoc {
  return {
    title: "Calm Body Choices",
    subtitle: "Pick one when it's time for a pit stop.",
    sections: [{ items: CALM_STRATEGIES.map((strategy) => strategy.label) }],
  };
}

export function getTurnTakingCardsPrintable(): PrintableDoc {
  return {
    title: "Turn Taking Cards",
    subtitle: "Cut apart and use during Two-Player Mode.",
    sections: [{ items: FAMILY_MEMBERS.map((member) => member.displayName) }],
  };
}

export function getRewardChartPrintable(unlockedRewardIds: string[]): PrintableDoc {
  return {
    title: "Reward Chart",
    sections: [
      {
        heading: "Unlocked",
        items: REWARDS.filter((r) => unlockedRewardIds.includes(r.id)).map((r) => r.name),
      },
      {
        heading: "Still to Unlock",
        items: REWARDS.filter((r) => !unlockedRewardIds.includes(r.id)).map((r) => r.name),
      },
    ],
  };
}

const HOME_PRACTICE_IDEAS = [
  "Use First/Then before cleanup: First clean up cars, then race one car.",
  "Count toy cars during play: one car, two cars, three cars.",
  "Practice 'help please' when opening snacks or toys.",
  "Practice 'no thank you' instead of screaming or pushing away.",
  "Draw roads, wheels, circles, and X roadblocks with chalk or crayons.",
  "Take turns racing cars with King, Halani, Londyn, or Amahni.",
  "Read a short story using silly voices and ask him to point to pictures.",
  "Use movement before sitting work: jump 5 times, then trace one line.",
];

export function getHomePracticeSheetPrintable(): PrintableDoc {
  return {
    title: "Home Practice Ideas",
    sections: [{ items: HOME_PRACTICE_IDEAS }],
  };
}

export function getTeacherSummaryPrintable(
  childName: string,
  skillSummaries: SkillProgressSummary[],
  insights: ParentInsight[],
): PrintableDoc {
  return {
    title: `Teacher Summary — ${childName}`,
    sections: [
      {
        heading: "Skill Levels",
        items: skillSummaries.map((s) => `${s.skill}: level ${s.level} (streak ${s.successStreak}/3)`),
      },
      {
        heading: "What's Working",
        items: insights.filter((i) => i.type === "what_worked").map((i) => i.message),
      },
      {
        heading: "Suggested Classroom Strategies",
        items: insights.filter((i) => i.type === "why").map((i) => i.message),
      },
    ],
  };
}
