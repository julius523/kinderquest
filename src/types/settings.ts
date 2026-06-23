export type AppSettings = {
  id?: number;
  key: string;
  readAloudEnabled: boolean;
  voiceVolume: number;
  musicVolume: number;
  soundEffectsVolume: number;
  speechRate: number;
  reducedMotionEnabled: boolean;
  speechRecognitionEnabled: boolean;
  parentConfirmationEnabled: boolean;
  recordRawAudioEnabled: boolean;
  youtubeEnabled: boolean;
  sessionTimerEnabled: boolean;
  updatedAt: number;
};

export const DEFAULT_APP_SETTINGS: Omit<AppSettings, "id"> = {
  key: "default",
  readAloudEnabled: true,
  voiceVolume: 1,
  musicVolume: 0.6,
  soundEffectsVolume: 0.8,
  speechRate: 0.85,
  reducedMotionEnabled: false,
  speechRecognitionEnabled: true,
  parentConfirmationEnabled: true,
  recordRawAudioEnabled: false,
  youtubeEnabled: false,
  sessionTimerEnabled: false,
  updatedAt: Date.now(),
};
