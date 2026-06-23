import type { SkillName } from "./game";

export type RewardCategory = "car" | "boat" | "super_suit" | "trophy" | "badge" | "sound" | "track_piece";
export type RewardRarity = "common" | "uncommon" | "special" | "rare";

export type Reward = {
  id: string;
  name: string;
  category: RewardCategory;
  rarity: RewardRarity;
  unlockSkill: SkillName;
  praiseText: string;
  icon?: string;
};

export type RewardEvent = {
  id?: number;
  childProfileId: number;
  sessionId: number;
  rewardId: string;
  skill: SkillName;
  timestamp: number;
};
