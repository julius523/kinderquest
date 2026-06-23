/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME?: string;
  readonly VITE_STORAGE_MODE?: string;
  readonly VITE_TEXT_TO_SPEECH_ENABLED?: string;
  readonly VITE_SPEECH_RECOGNITION_ENABLED?: string;
  readonly VITE_YOUTUBE_ENABLED?: string;
  readonly VITE_YOUTUBE_API_KEY?: string;
  readonly VITE_YOUTUBE_APPROVED_CHANNEL_IDS?: string;
  readonly VITE_YOUTUBE_APPROVED_PLAYLIST_IDS?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
