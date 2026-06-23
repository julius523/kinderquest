import { useState } from "react";
import { useReadAloud } from "../../hooks/useReadAloud";
import { speak } from "../../services/textToSpeechService";
import { Icon } from "../../utils/icon";
import { CALM_STRATEGIES, type CalmStrategy } from "../../data/calmStrategies";

type CalmChoiceBoardProps = {
  onComplete: (outcome: "ready" | "more_break", strategyId: string) => void;
};

/** Calm Body Pit Stop choice board. Step 1: pick a calming strategy. Step 2:
 * "Are you ready, or do you need more break?" — never forces a return. */
export function CalmChoiceBoard({ onComplete }: CalmChoiceBoardProps) {
  const [chosen, setChosen] = useState<CalmStrategy | null>(null);
  useReadAloud(chosen ? "Are you ready, or need more break?" : "Pit stop. Let's help your body feel safe.");

  if (chosen) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl bg-indigo-50 p-6 text-center">
        <p className="text-lg font-bold text-indigo-800">{chosen.spokenInstruction}</p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => {
              speak("I'm ready");
              onComplete("ready", chosen.id);
            }}
            className="rounded-2xl bg-green-500 px-6 py-4 text-lg font-bold text-white"
          >
            I&apos;m ready
          </button>
          <button
            type="button"
            onClick={() => {
              speak("More break");
              onComplete("more_break", chosen.id);
              setChosen(null);
            }}
            className="rounded-2xl bg-slate-300 px-6 py-4 text-lg font-bold text-slate-700"
          >
            More break
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-3xl bg-indigo-50 p-4">
      <p className="text-center text-lg font-bold text-indigo-800">
        Pit stop. Let&apos;s help your body feel safe.
      </p>
      <div className="grid grid-cols-2 gap-2">
        {CALM_STRATEGIES.map((strategy) => (
          <button
            key={strategy.id}
            type="button"
            onClick={() => {
              speak(strategy.spokenInstruction);
              setChosen(strategy);
            }}
            className="flex flex-col items-center gap-1 rounded-2xl bg-white p-3 text-sm font-semibold text-indigo-700 shadow"
          >
            <Icon name={strategy.icon} size={28} />
            <span>{strategy.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
