import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { speak } from "../../services/textToSpeechService";

const HOLD_DURATION_MS = 3000;

type MathChallenge = {
  prompt: string;
  answer: number;
};

function generateChallenge(): MathChallenge {
  const a = 3 + Math.floor(Math.random() * 6);
  const b = 2 + Math.floor(Math.random() * 6);
  return { prompt: `${a} + ${b}`, answer: a + b };
}

type ParentGateProps = {
  onUnlock: () => void;
};

/** Grown-ups-only gate: hold a button for 3 seconds, then answer a simple
 * adult math question. Deliberately has no child-readable shortcut. */
export function ParentGate({ onUnlock }: ParentGateProps) {
  const [holdProgress, setHoldProgress] = useState(0);
  const [showMath, setShowMath] = useState(false);
  const [challenge, setChallenge] = useState<MathChallenge>(() => generateChallenge());
  const [answerInput, setAnswerInput] = useState("");
  const [error, setError] = useState(false);

  const holdStartRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);

  function startHold() {
    holdStartRef.current = Date.now();
    const tick = () => {
      if (!holdStartRef.current) return;
      const elapsed = Date.now() - holdStartRef.current;
      const progress = Math.min(elapsed / HOLD_DURATION_MS, 1);
      setHoldProgress(progress);

      if (progress >= 1) {
        setShowMath(true);
        speak(`Grown-ups only. Answer: ${challenge.prompt}.`);
        return;
      }
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
  }

  function cancelHold() {
    holdStartRef.current = null;
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    setHoldProgress(0);
  }

  function submitAnswer() {
    if (Number(answerInput) === challenge.answer) {
      onUnlock();
      return;
    }
    setError(true);
    setChallenge(generateChallenge());
    setAnswerInput("");
  }

  if (showMath) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-100 px-6 text-center">
        <h1 className="text-2xl font-bold text-slate-700">Grown-ups only</h1>
        <p className="text-xl text-slate-600">What is {challenge.prompt}?</p>
        <input
          type="number"
          inputMode="numeric"
          value={answerInput}
          onChange={(event) => {
            setError(false);
            setAnswerInput(event.target.value);
          }}
          className="w-32 rounded-xl border-2 border-slate-300 px-4 py-3 text-center text-2xl"
          autoFocus
        />
        {error && <p className="text-sm text-rose-500">Try again.</p>}
        <button
          type="button"
          onClick={submitAnswer}
          className="rounded-2xl bg-slate-700 px-8 py-3 text-lg font-semibold text-white"
        >
          Continue
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-100 px-6 text-center">
      <h1 className="text-2xl font-bold text-slate-700">Grown-ups only</h1>
      <p className="text-slate-500">Hold the button for 3 seconds.</p>
      <motion.button
        type="button"
        onPointerDown={startHold}
        onPointerUp={cancelHold}
        onPointerLeave={cancelHold}
        className="relative flex h-32 w-32 items-center justify-center rounded-full bg-slate-300 text-slate-700"
      >
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="46" fill="none" stroke="#94a3b8" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="#334155"
            strokeWidth="8"
            strokeDasharray={2 * Math.PI * 46}
            strokeDashoffset={2 * Math.PI * 46 * (1 - holdProgress)}
          />
        </svg>
        <span className="text-sm font-semibold">Hold</span>
      </motion.button>
    </div>
  );
}
