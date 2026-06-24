import { afterEach, describe, expect, it, vi } from "vitest";
import { fuzzyMatch, browserSupportsSpeechRecognition, listenForPhrase } from "../services/speechRecognitionService";
import { speak, stopSpeaking, unlockSpeechSynthesis } from "../services/textToSpeechService";
import { useSettingsStore } from "../state/settingsStore";

describe("fuzzyMatch", () => {
  it("scores an exact match as 1", () => {
    expect(fuzzyMatch("help please", "help please")).toBe(1);
  });

  it("is forgiving of partial/unclear speech", () => {
    const score = fuzzyMatch("hep peas", "help please");
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThan(1);
  });

  it("gives credit for word overlap regardless of punctuation/case", () => {
    expect(fuzzyMatch("My Turn!", "my turn")).toBe(1);
  });
});

describe("speechRecognitionService", () => {
  it("reports unsupported in environments without SpeechRecognition (e.g. jsdom)", () => {
    expect(browserSupportsSpeechRecognition()).toBe(false);
  });

  it("never fails the child outright — returns a graceful status when unsupported", async () => {
    const result = await listenForPhrase("help please");
    expect(["unsupported", "disabled"]).toContain(result.status);
  });

  it("returns disabled when the parent has turned off speech recognition", async () => {
    useSettingsStore.setState((state) => ({
      settings: { ...state.settings, speechRecognitionEnabled: false },
    }));
    const result = await listenForPhrase("help please");
    expect(result.status).toBe("disabled");
  });
});

describe("textToSpeechService", () => {
  it("does not throw when speechSynthesis is unavailable (jsdom)", () => {
    expect(() => speak("hello")).not.toThrow();
    expect(() => stopSpeaking()).not.toThrow();
  });

  it("calls onEnd immediately as a fallback when speech synthesis is unsupported", () => {
    const onEnd = vi.fn();
    speak("hello", { onEnd });
    expect(onEnd).toHaveBeenCalled();
  });
});

describe("unlockSpeechSynthesis", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("speaks one silent warmup utterance the first time it's called from a real gesture, and is a no-op after that", () => {
    const speakSpy = vi.fn();
    vi.stubGlobal("speechSynthesis", { speak: speakSpy, cancel: vi.fn() });
    vi.stubGlobal(
      "SpeechSynthesisUtterance",
      class {
        text: string;
        volume = 1;
        constructor(text: string) {
          this.text = text;
        }
      },
    );

    unlockSpeechSynthesis();
    unlockSpeechSynthesis();
    unlockSpeechSynthesis();

    expect(speakSpy).toHaveBeenCalledTimes(1);
    const [utterance] = speakSpy.mock.calls[0];
    expect(utterance.volume).toBe(0);
  });
});
