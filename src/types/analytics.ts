import type { PromptLevel, RegulationState } from "./game";

export type ChildState = {
  engagementScore: number;
  rapidTapBursts: number;
  idleEvents: number;
  frustrationMarkers: number;
  refusals: number;
  transitionDifficulty: boolean;
  energyLevel: "low" | "medium" | "high";
  regulationState: RegulationState;
};

export type PromptEvent = {
  id?: number;
  sessionId: number;
  activityResultId: number;
  promptLevel: PromptLevel;
  timestamp: number;
};

export type BehaviorEventType =
  | "frustration_marker"
  | "rapid_tap_burst"
  | "idle"
  | "refusal"
  | "calm_break_used"
  | "movement_break_used"
  | "transition_success"
  | "transition_difficulty";

export type BehaviorEvent = {
  id?: number;
  sessionId: number;
  eventType: BehaviorEventType;
  intensity: number;
  timestamp: number;
};

export type InsightType = "what_worked" | "why" | "home_practice" | "next_session";

export type ParentInsight = {
  id?: number;
  childProfileId: number;
  sessionId?: number;
  type: InsightType;
  title: string;
  message: string;
  createdAt: number;
};

export type SessionPatterns = {
  averageEngagement: number;
  carThemeEngagement: number;
  carThemeEngagementHigh: boolean;
  firstThenSuccessRate: number;
  movementReturnRate: number;
  movementReturnRateHigh: boolean;
  visualPromptSuccessHigh: boolean;
  parentConfirmedSpeechSuccess: number;
  voiceRecognitionSuccess: number;
};
