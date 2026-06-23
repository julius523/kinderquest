import type { ActivityResult, Session } from "../types/activity";
import type { SkillName } from "../types/game";
import type { SkillProgressRecord } from "../types/db";

export type SessionSummary = {
  minutesPlayed: number;
  activitiesAttempted: number;
  activitiesCompleted: number;
  bestSkill?: SkillName;
  hardestSkill?: SkillName;
  engagementScore: number;
  calmBreaksUsed: number;
  movementBreaksUsed: number;
  rewardsUnlockedCount: number;
};

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function computeSessionSummary(session: Session, results: ActivityResult[]): SessionSummary {
  const endedAt = session.endedAt ?? Date.now();
  const minutesPlayed = Math.max(0, (endedAt - session.startedAt) / 60_000);

  const accuracyBySkill = new Map<SkillName, number[]>();
  for (const result of results) {
    const list = accuracyBySkill.get(result.skill) ?? [];
    list.push(result.accuracy);
    accuracyBySkill.set(result.skill, list);
  }

  const skillAverages = Array.from(accuracyBySkill.entries()).map(([skill, accuracies]) => ({
    skill,
    average: average(accuracies),
  }));
  skillAverages.sort((a, b) => b.average - a.average);

  return {
    minutesPlayed,
    activitiesAttempted: results.length,
    activitiesCompleted: results.filter((r) => r.completed).length,
    bestSkill: skillAverages[0]?.skill,
    hardestSkill: skillAverages[skillAverages.length - 1]?.skill,
    engagementScore: session.engagementScore,
    calmBreaksUsed: session.regulationSummary.calmBreaksUsed,
    movementBreaksUsed: session.regulationSummary.movementBreaksUsed,
    rewardsUnlockedCount: session.rewardsUnlocked.length,
  };
}

export type SkillProgressSummary = {
  skill: SkillName;
  level: number;
  successStreak: number;
  supportNeeded: number;
};

export function summarizeSkillProgress(records: SkillProgressRecord[]): SkillProgressSummary[] {
  return records
    .map((record) => ({
      skill: record.skill,
      level: record.level,
      successStreak: record.successStreak,
      supportNeeded: record.supportNeeded,
    }))
    .sort((a, b) => a.skill.localeCompare(b.skill));
}
