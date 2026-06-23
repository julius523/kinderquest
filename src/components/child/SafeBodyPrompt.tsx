import { useReadAloud } from "../../hooks/useReadAloud";
import { speak } from "../../services/textToSpeechService";
import { BigButton } from "./BigButton";

type SafeBodyPromptProps = {
  instruction: string;
  choices: string[];
  correctAnswer: string;
  onChoice: (choice: string, isSafe: boolean) => void;
};

/** Safe-behavior choice scenarios (gentle hands, safe body, stop please).
 * There is no "wrong" feedback shown here — the engine decides what
 * happens next (model + retry), this component just reports the tap. */
export function SafeBodyPrompt({ instruction, choices, correctAnswer, onChoice }: SafeBodyPromptProps) {
  useReadAloud(instruction);

  return (
    <div className="flex flex-col items-center gap-4 rounded-3xl bg-white p-6 shadow-lg">
      <p className="text-center text-xl font-bold text-slate-700">{instruction}</p>
      <div className="flex flex-wrap justify-center gap-3">
        {choices.map((choice) => (
          <BigButton
            key={choice}
            label={choice}
            variant="secondary"
            onClick={() => {
              speak(choice);
              onChoice(choice, choice === correctAnswer);
            }}
          />
        ))}
      </div>
    </div>
  );
}
