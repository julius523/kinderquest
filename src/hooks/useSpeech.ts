import { useCallback, useState } from "react";
import { speak, stopSpeaking } from "../services/textToSpeechService";
import { browserSupportsSpeechRecognition, listenForPhrase } from "../services/speechRecognitionService";
import type { SpeakOptions } from "../types/speech";

export function useSpeech() {
  const [isListening, setIsListening] = useState(false);

  const say = useCallback((text: string, options?: SpeakOptions) => {
    speak(text, options);
  }, []);

  const listen = useCallback(async (targetPhrase: string, timeoutSeconds?: number) => {
    setIsListening(true);
    try {
      return await listenForPhrase(targetPhrase, timeoutSeconds);
    } finally {
      setIsListening(false);
    }
  }, []);

  return {
    speak: say,
    stop: stopSpeaking,
    listen,
    isListening,
    speechRecognitionSupported: browserSupportsSpeechRecognition(),
  };
}
