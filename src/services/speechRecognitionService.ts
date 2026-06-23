import { useSettingsStore } from "../state/settingsStore";
import type { SpeechAttemptResult } from "../types/speech";

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((event: unknown) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

function getSpeechRecognitionConstructor(): SpeechRecognitionConstructor | undefined {
  if (typeof window === "undefined") return undefined;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

export function browserSupportsSpeechRecognition(): boolean {
  return Boolean(getSpeechRecognitionConstructor());
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Word-overlap similarity score from 0 to 1. Forgiving on purpose — a child's
 * speech may be unclear, so we never want to fail them for an imperfect match. */
export function fuzzyMatch(transcript: string, targetPhrase: string): number {
  const transcriptWords = new Set(normalize(transcript).split(" ").filter(Boolean));
  const targetWords = normalize(targetPhrase).split(" ").filter(Boolean);
  if (targetWords.length === 0) return 0;

  if (normalize(transcript) === normalize(targetPhrase)) return 1;

  const matches = targetWords.filter((word) => transcriptWords.has(word)).length;
  return matches / targetWords.length;
}

export async function listenForPhrase(
  targetPhrase: string,
  timeoutSeconds = 6,
): Promise<SpeechAttemptResult> {
  const { settings } = useSettingsStore.getState();
  if (!settings.speechRecognitionEnabled) {
    return { status: "disabled" };
  }

  const SpeechRecognitionCtor = getSpeechRecognitionConstructor();
  if (!SpeechRecognitionCtor) {
    return { status: "unsupported" };
  }

  return new Promise<SpeechAttemptResult>((resolve) => {
    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;

    const timeout = setTimeout(() => {
      recognition.abort();
      resolve({ status: "attempted" });
    }, timeoutSeconds * 1000);

    recognition.onresult = (event) => {
      clearTimeout(timeout);
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      const confidence = fuzzyMatch(transcript, targetPhrase);
      resolve({
        status: confidence >= 0.6 ? "matched" : "uncertain",
        transcript,
        confidence,
      });
    };

    recognition.onerror = (error) => {
      clearTimeout(timeout);
      resolve({ status: "error", error });
    };

    recognition.onend = () => {
      clearTimeout(timeout);
    };

    recognition.start();
  });
}
