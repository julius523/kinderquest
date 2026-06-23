import type {
  ActivityLevel,
  ActivityType,
  DeviceType,
  InterestTag,
  PromptLevel,
  ResponseMode,
  SkillName,
} from "./game";

export type ActivityDefinition = {
  id: string;
  type: ActivityType;
  skill: SkillName;
  level?: ActivityLevel;
  theme?: string;

  instruction: string;
  spokenInstruction: string;
  verbalHint?: string;

  /** tap-choice activities (letters, shapes, colors) */
  choices?: string[];
  correctAnswer?: string | number;

  /** counting activities */
  targetCount?: number;
  objectType?: string;

  /** color activities */
  targetColor?: string;

  /** speech / communication activities */
  targetPhrase?: string;
  acceptablePhrases?: string[];
  acceptedResponseModes?: ResponseMode[];

  /** prewriting */
  targetForm?: string;

  /** listening direction sequences */
  sequence?: string[];
  objects?: string[];

  /** movement / calm */
  movement?: string;
  count?: number;
  strategy?: string;
  durationSeconds?: number;

  /** turn taking */
  partnerId?: string;
  targetPhrases?: string[];

  interests?: InterestTag[];
  supports?: string[];
  isNonPreferred?: boolean;
  maxAttemptsBeforeSupport?: number;
};

export type ActivityResult = {
  id?: number;
  sessionId: number;
  childProfileId: number;

  activityId: string;
  activityType: ActivityType;
  skill: SkillName;
  theme: string;

  startedAt: number;
  endedAt?: number;
  completed: boolean;
  skipped: boolean;

  attempts: number;
  correctAttempts: number;
  accuracy: number;

  promptLevelUsed: PromptLevel;
  responseMode: ResponseMode;

  transitionSupportUsed: boolean;
  firstThenUsed: boolean;
  visualScheduleUsed: boolean;
  communicationBoardUsed: boolean;

  frustrationMarkers: number;
  rapidTapBursts: number;
  idleEvents: number;

  interests: InterestTag[];
  rewardGiven?: string;
};

export type RegulationSummary = {
  frustrationMarkers: number;
  rapidTapBursts: number;
  idleEvents: number;
  movementBreaksUsed: number;
  calmBreaksUsed: number;
  successfulTransitions: number;
  difficultTransitions: number;
};

export type Session = {
  id?: number;
  childProfileId: number;
  startedAt: number;
  endedAt?: number;

  deviceType: DeviceType;
  scheduleItems: string[];

  completedActivities: number;
  skippedActivities: number;
  totalAttempts: number;
  totalCorrect: number;

  engagementScore: number;
  regulationSummary: RegulationSummary;

  rewardsUnlocked: string[];
  parentRating?: 1 | 2 | 3 | 4 | 5;
  parentNotes?: string;
};

export function createEmptySession(childProfileId: number, deviceType: DeviceType): Session {
  return {
    childProfileId,
    startedAt: Date.now(),
    deviceType,
    scheduleItems: [],
    completedActivities: 0,
    skippedActivities: 0,
    totalAttempts: 0,
    totalCorrect: 0,
    engagementScore: 50,
    regulationSummary: {
      frustrationMarkers: 0,
      rapidTapBursts: 0,
      idleEvents: 0,
      movementBreaksUsed: 0,
      calmBreaksUsed: 0,
      successfulTransitions: 0,
      difficultTransitions: 0,
    },
    rewardsUnlocked: [],
  };
}
