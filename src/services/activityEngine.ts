import {
  saveActivityResult,
  getActivityResultsForSession,
  getSkillProgress,
  upsertSkillProgress,
  getInterest,
  upsertInterest,
  recordReward,
  isRewardUnlocked,
} from "../db/repositories/activityRepo";
import { getSession, updateSession } from "../db/repositories/sessionRepo";
import { getProfile, updateProfile } from "../db/repositories/profileRepo";
import { getRewardsForSkill, getSpecificPraise } from "../data/rewards";
import { calculateEngagementScore } from "./engagementEngine";
import type { ActivityDefinition } from "../types/activity";
import type { PromptLevel, ResponseMode, SkillName } from "../types/game";
import type { Reward } from "../types/rewards";

type FinishActivityParams = {
  childProfileId: number;
  sessionId: number;
  activity: ActivityDefinition;
  attempts: number;
  correctAttempts: number;
  promptLevelUsed: PromptLevel;
  responseMode: ResponseMode;
  frustrationMarkers?: number;
  rapidTapBursts?: number;
  idleEvents?: number;
};

export type FinishActivityOutcome = {
  reward: Reward;
  praiseText: string;
};

/**
 * Shared completion path for every learning activity scene: saves the
 * result, updates skill progress and interest scores, and chooses a reward.
 * The full session-level adaptive engine (engagement scoring, what plays
 * next) builds on top of this in a later phase — this function only
 * scores a single completed activity.
 */
export async function finishActivity(params: FinishActivityParams): Promise<FinishActivityOutcome> {
  const accuracy = params.attempts > 0 ? params.correctAttempts / params.attempts : 0;
  const completed = params.correctAttempts > 0;
  const now = Date.now();

  await saveActivityResult({
    sessionId: params.sessionId,
    childProfileId: params.childProfileId,
    activityId: params.activity.id,
    activityType: params.activity.type,
    skill: params.activity.skill,
    theme: params.activity.theme ?? "",
    startedAt: now,
    endedAt: now,
    completed,
    skipped: false,
    attempts: params.attempts,
    correctAttempts: params.correctAttempts,
    accuracy,
    promptLevelUsed: params.promptLevelUsed,
    responseMode: params.responseMode,
    transitionSupportUsed: false,
    firstThenUsed: false,
    visualScheduleUsed: false,
    communicationBoardUsed: false,
    frustrationMarkers: params.frustrationMarkers ?? 0,
    rapidTapBursts: params.rapidTapBursts ?? 0,
    idleEvents: params.idleEvents ?? 0,
    interests: params.activity.interests ?? [],
  });

  await updateSkillProgress(params.childProfileId, params.activity.skill, completed, params.promptLevelUsed);
  await updateInterestProfile(params.childProfileId, params.activity.interests ?? [], completed, accuracy);

  const reward = await chooseReward(params.childProfileId, params.sessionId, params.activity.skill);
  await updateSessionTotals(params.sessionId, params, completed, reward.id);
  await applyRewardToAvatar(params.childProfileId, reward);

  return { reward, praiseText: reward.praiseText };
}

/** Cars/boats/super-suits are visible, not just a line in a reward
 * table — unlocking one adds it to the avatar and equips it immediately,
 * so progression actually shows up next time the child sees their
 * character. */
async function applyRewardToAvatar(childProfileId: number, reward: Reward): Promise<void> {
  if (reward.category !== "car" && reward.category !== "boat" && reward.category !== "super_suit") {
    return;
  }

  const profile = await getProfile(childProfileId);
  if (!profile?.id) return;

  const avatar = { ...profile.avatar };

  if (reward.category === "car" && !avatar.unlockedCars.includes(reward.id)) {
    avatar.unlockedCars = [...avatar.unlockedCars, reward.id];
    avatar.activeCar = reward.id;
  }
  if (reward.category === "boat" && !avatar.unlockedBoats.includes(reward.id)) {
    avatar.unlockedBoats = [...avatar.unlockedBoats, reward.id];
    avatar.activeBoat = reward.id;
  }
  if (reward.category === "super_suit" && !avatar.unlockedSuits.includes(reward.id)) {
    avatar.unlockedSuits = [...avatar.unlockedSuits, reward.id];
    avatar.activeSuit = reward.id;
  }

  await updateProfile(profile.id, { avatar });
}

async function updateSessionTotals(
  sessionId: number,
  params: FinishActivityParams,
  completed: boolean,
  rewardId: string,
): Promise<void> {
  const session = await getSession(sessionId);
  if (!session) return;

  const sessionResults = await getActivityResultsForSession(sessionId);
  const engagementScore = calculateEngagementScore(sessionResults.slice(-5));

  await updateSession(sessionId, {
    completedActivities: session.completedActivities + (completed ? 1 : 0),
    totalAttempts: session.totalAttempts + params.attempts,
    totalCorrect: session.totalCorrect + params.correctAttempts,
    engagementScore,
    rewardsUnlocked: [...session.rewardsUnlocked, rewardId],
  });
}

async function updateSkillProgress(
  childProfileId: number,
  skill: SkillName,
  completed: boolean,
  promptLevelUsed: PromptLevel,
): Promise<void> {
  const existing = await getSkillProgress(childProfileId, skill);
  const earnedIndependently = completed && promptLevelUsed !== "caregiver";
  const successStreak = earnedIndependently ? (existing?.successStreak ?? 0) + 1 : 0;
  const leveledUp = successStreak >= 3;

  await upsertSkillProgress({
    id: existing?.id,
    childProfileId,
    skill,
    level: leveledUp ? (existing?.level ?? 0) + 1 : existing?.level ?? 0,
    successStreak: leveledUp ? 0 : successStreak,
    supportNeeded: completed ? existing?.supportNeeded ?? 0 : (existing?.supportNeeded ?? 0) + 1,
    updatedAt: Date.now(),
  });
}

async function updateInterestProfile(
  childProfileId: number,
  interests: ActivityDefinition["interests"],
  completed: boolean,
  accuracy: number,
): Promise<void> {
  for (const tag of interests ?? []) {
    const existing = await getInterest(childProfileId, tag);
    let delta = 0;
    if (completed) delta += 3;
    if (accuracy >= 0.8) delta += 2;
    if (!completed) delta -= 2;

    await upsertInterest({
      id: existing?.id,
      childProfileId,
      tag,
      score: (existing?.score ?? 0) + delta,
      updatedAt: Date.now(),
    });
  }
}

async function chooseReward(
  childProfileId: number,
  sessionId: number,
  skill: SkillName,
): Promise<Reward> {
  const candidates = getRewardsForSkill(skill);

  for (const candidate of candidates) {
    const unlocked = await isRewardUnlocked(childProfileId, candidate.id);
    if (!unlocked) {
      await recordReward({
        childProfileId,
        sessionId,
        rewardId: candidate.id,
        category: candidate.category,
        skill,
        unlockedAt: Date.now(),
      });
      return candidate;
    }
  }

  return {
    id: `repeat_${skill}_${Date.now()}`,
    name: "Great Job",
    category: "trophy",
    rarity: "common",
    unlockSkill: skill,
    praiseText: getSpecificPraise(skill),
  };
}
