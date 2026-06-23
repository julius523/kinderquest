import { applyPronunciation } from "../data/pronunciationMap";
import { useSettingsStore } from "../state/settingsStore";
import type { SpeakOptions } from "../types/speech";

function isSpeechSynthesisSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function isReadAloudEnabled(): boolean {
  return useSettingsStore.getState().settings.readAloudEnabled;
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
