import { db } from "../db";
import type { ActivityResult } from "../../types/activity";
import type { SkillName } from "../../types/game";
import type { InterestRecord, RewardRecord, SkillProgressRecord } from "../../types/db";

export async function saveActivityResult(result: ActivityResult): Promise<ActivityResult> {
  if (result.id) {
    await db.activityResults.put(result);
    return result;
  }
  const id = await db.activityResults.add(result);
  return { ...result, id };
}

export async function getActivityResultsForSession(sessionId: number): Promise<ActivityResult[]> {
  return db.activityResults.where("sessionId").equals(sessionId).sortBy("startedAt");
}

export async function getRecentActivityResults(
  childProfileId: number,
  limit: number,
): Promise<ActivityResult[]> {
  const results = await db.activityResults
    .where("childProfileId")
    .equals(childProfileId)
    .reverse()
    .sortBy("startedAt");
  return results.slice(0, limit);
}

export async function getActivityResultsForChild(childProfileId: number): Promise<ActivityResult[]> {
  return db.activityResults.where("childProfileId").equals(childProfileId).sortBy("startedAt");
}

export async function getSkillProgress(
  childProfileId: number,
  skill: SkillName,
): Promise<SkillProgressRecord | undefined> {
  return db.skillProgress
    .where("childProfileId")
    .equals(childProfileId)
    .filter((record) => record.skill === skill)
    .first();
}

export async function upsertSkillProgress(record: SkillProgressRecord): Promise<SkillProgressRecord> {
  if (record.id) {
    await db.skillProgress.put(record);
    return record;
  }
  const id = await db.skillProgress.add(record);
  return { ...record, id };
}

export async function getAllSkillProgress(childProfileId: number): Promise<SkillProgressRecord[]> {
  return db.skillProgress.where("childProfileId").equals(childProfileId).toArray();
}

export async function getInterest(
  childProfileId: number,
  tag: string,
): Promise<InterestRecord | undefined> {
  return db.interests
    .where("childProfileId")
    .equals(childProfileId)
    .filter((record) => record.tag === tag)
    .first();
}

export async function upsertInterest(record: InterestRecord): Promise<InterestRecord> {
  if (record.id) {
    await db.interests.put(record);
    return record;
  }
  const id = await db.interests.add(record);
  return { ...record, id };
}

export async function getAllInterests(childProfileId: number): Promise<InterestRecord[]> {
  return db.interests.where("childProfileId").equals(childProfileId).toArray();
}

export async function recordReward(record: RewardRecord): Promise<RewardRecord> {
  const id = await db.rewards.add(record);
  return { ...record, id };
}

export async function getRewardsForChild(childProfileId: number): Promise<RewardRecord[]> {
  return db.rewards.where("childProfileId").equals(childProfileId).toArray();
}

export async function isRewardUnlocked(childProfileId: number, rewardId: string): Promise<boolean> {
  const match = await db.rewards
    .where("childProfileId")
    .equals(childProfileId)
    .filter((record) => record.rewardId === rewardId)
    .first();
  return Boolean(match);
}
