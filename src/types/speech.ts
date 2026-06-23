export type SpeakOptions = {
  rate?: number;
  pitch?: number;
  volume?: number;
  onEnd?: () => void;
};

export type SpeechAttemptStatus =
  | "matched"
  | "uncertain"
  | "attempted"
  | "parent_confirmed"
  | "disabled"
  | "unsupported"
  | "error";

export type SpeechAttemptResult = {
  status: SpeechAttemptStatus;
  transcript?: string;
  confidence?: number;
  error?: unknown;
};

export type CommunicationEvent = {
  id?: number;
  sessionId: number;
  childProfileId: number;
  phraseId: string;
  responseMode: "tap" | "voice" | "parentConfirm" | "gesture";
  success: boolean;
  timestamp: number;
};
