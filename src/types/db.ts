import type { SkillName } from "./game";
import type { InterestScore, SkillLevel } from "./child";

export type SkillProgressRecord = SkillLevel & {
  id?: number;
  childProfileId: number;
};

export type InterestRecord = InterestScore & {
  id?: number;
  childProfileId: number;
};

export type RewardRecord = {
  id?: number;
  childProfileId: number;
  sessionId: number;
  rewardId: string;
  category: string;
  skill: SkillName;
  unlockedAt: number;
};

export type ParentNoteRecord = {
  id?: number;
  sessionId: number;
  note: string;
  createdAt: number;
};

export type PrintableRecord = {
  id?: number;
  type: string;
  payload: string;
  createdAt: number;
};
