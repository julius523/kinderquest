import { useEffect } from "react";
import { speak, stopSpeaking } from "../services/textToSpeechService";
import type { SpeakOptions } from "../types/speech";

/** Speaks `text` once when the screen/component mounts (or when `text` changes),
 * matching the rule that every screen must speak its main instruction on load. */
export function useReadAloud(text: string | null | undefined, options?: SpeakOptions): void {
  useEffect(() => {
    if (!text) return;
    speak(text, options);
    return () => stopSpeaking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);
}
