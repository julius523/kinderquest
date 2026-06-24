import { applyPronunciation } from "../data/pronunciationMap";
import { useSettingsStore } from "../state/settingsStore";
import type { SpeakOptions } from "../types/speech";

function isSpeechSynthesisSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function isReadAloudEnabled(): boolean {
  return useSettingsStore.getState().settings.readAloudEnabled;
}

// Several browsers (most notably iOS Safari) silently drop
// speechSynthesis.speak() calls that don't happen inside a genuine user
// gesture — and every speak() in this app is called from a useEffect or
// a state-change handler, never directly inside a gesture's own call
// stack, so without this every utterance would be silently swallowed on
// those browsers. Speaking one (silent) utterance from inside a real
// pointerdown/keydown handler "unlocks" the engine for the rest of the
// page's life, after which async calls work normally. Wired up once at
// the app root via unlockSpeechSynthesis().
let unlocked = false;

export function unlockSpeechSynthesis(): void {
  if (unlocked || !isSpeechSynthesisSupported()) return;
  unlocked = true;
  const warmup = new SpeechSynthesisUtterance(" ");
  warmup.volume = 0;
  window.speechSynthesis.speak(warmup);
}

/**
 * Reads text aloud via the browser's SpeechSynthesis API. Every visible word,
 * instruction, and piece of feedback in the app should go through this
 * function so a child who can't yet read can still understand everything.
 */
export function speak(text: string, options: SpeakOptions = {}): void {
  if (!isSpeechSynthesisSupported()) {
    options.onEnd?.();
    return;
  }

  const { settings } = useSettingsStore.getState();
  if (!settings.readAloudEnabled) {
    options.onEnd?.();
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(applyPronunciation(text));
  utterance.rate = options.rate ?? settings.speechRate;
  utterance.pitch = options.pitch ?? 1.05;
  utterance.volume = options.volume ?? settings.voiceVolume;
  if (options.onEnd) {
    utterance.onend = options.onEnd;
  }

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
}

export function repeatLast(text: string): void {
  speak(text);
}
