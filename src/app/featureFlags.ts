function readBool(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  return value === "true" || value === "1";
}

function readList(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export const featureFlags = {
  appName: import.meta.env.VITE_APP_NAME ?? "Kinder Quest",
  storageMode: import.meta.env.VITE_STORAGE_MODE ?? "local",
  textToSpeechEnabled: readBool(import.meta.env.VITE_TEXT_TO_SPEECH_ENABLED, true),
  speechRecognitionEnabled: readBool(import.meta.env.VITE_SPEECH_RECOGNITION_ENABLED, true),
  youtubeEnabledDefault: readBool(import.meta.env.VITE_YOUTUBE_ENABLED, false),
  youtubeApiKey: import.meta.env.VITE_YOUTUBE_API_KEY ?? "",
  youtubeApprovedChannelIds: readList(import.meta.env.VITE_YOUTUBE_APPROVED_CHANNEL_IDS),
  youtubeApprovedPlaylistIds: readList(import.meta.env.VITE_YOUTUBE_APPROVED_PLAYLIST_IDS),
};
