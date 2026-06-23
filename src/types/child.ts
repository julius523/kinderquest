import type { InterestTag, ResponseMode, SkillName } from "./game";

export type AvatarConfig = {
  id: string;
  unlockedCars: string[];
  unlockedBoats: string[];
  unlockedSuits: string[];
  activeCar?: string;
  activeBoat?: string;
  activeSuit?: string;
};

export type InterestScore = {
  tag: InterestTag;
  score: number;
  updatedAt: number;
};

export type SkillLevel = {
  skill: SkillName;
  level: number;
  successStreak: number;
  supportNeeded: number;
  updatedAt: number;
};

export type RewardPreference = {
  rewardId: string;
  timesChosen: number;
  lastChosenAt: number;
};

export type ChildProfile = {
  id?: number;
  name: string;
  ageYears: number;
  avatarId: string;
  avatar: AvatarConfig;
  currentPathNodeId: string;

  interests: Record<string, InterestScore>;
  skillLevels: Record<string, SkillLevel>;
  rewardPreferences: RewardPreference[];

  preferences: {
    favoriteThemes: string[];
    favoriteRewards: string[];
    preferredCharacters: string[];
    preferredResponseMode: ResponseMode;
    speechRecognitionEnabled: boolean;
    parentConfirmationEnabled: boolean;
    soundEffectsEnabled: boolean;
    musicEnabled: boolean;
    readAloudEnabled: boolean;
    reducedMotionEnabled: boolean;
  };

  communicationPreferences: {
    voiceEnabled: boolean;
    parentConfirmEnabled: boolean;
    preferredResponseMode: "tap" | "voice" | "mixed" | "parentConfirm";
  };

  supportNeeds: {
    useVisualSchedule: boolean;
    useFirstThen: boolean;
    useCommunicationBoard: boolean;
    useMovementBreaks: boolean;
    usePromptHierarchy: boolean;
    useCalmPitStop: boolean;
  };

  regulationProfile: {
    preferredBreaks: string[];
    signsOfFrustration: string[];
    helpfulStrategies: string[];
  };

  createdAt: number;
  updatedAt: number;
};

export function createDefaultChildProfile(name: string, ageYears: number): ChildProfile {
  const now = Date.now();
  return {
    name,
    ageYears,
    avatarId: "super_racer",
    avatar: {
      id: "super_racer",
      unlockedCars: ["red_rocket_car"],
      unlockedBoats: [],
      unlockedSuits: [],
      activeCar: "red_rocket_car",
    },
    currentPathNodeId: "welcome_garage",
    interests: {},
    skillLevels: {},
    rewardPreferences: [],
    preferences: {
      favoriteThemes: ["cars", "superhero"],
      favoriteRewards: [],
      preferredCharacters: ["super_racer", "captain_turbo"],
      preferredResponseMode: "mixed",
      speechRecognitionEnabled: true,
      parentConfirmationEnabled: true,
      soundEffectsEnabled: true,
      musicEnabled: true,
      readAloudEnabled: true,
      reducedMotionEnabled: false,
    },
    communicationPreferences: {
      voiceEnabled: true,
      parentConfirmEnabled: true,
      preferredResponseMode: "mixed",
    },
    supportNeeds: {
      useVisualSchedule: true,
      useFirstThen: true,
      useCommunicationBoard: true,
      useMovementBreaks: true,
      usePromptHierarchy: true,
      useCalmPitStop: true,
    },
    regulationProfile: {
      preferredBreaks: ["breathing", "jump", "squeeze_hands"],
      signsOfFrustration: [],
      helpfulStrategies: [],
    },
    createdAt: now,
    updatedAt: now,
  };
}
