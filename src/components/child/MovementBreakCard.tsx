import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useReadAloud } from "../../hooks/useReadAloud";
import { BigButton } from "./BigButton";
import type { MovementBreak } from "../../data/movementBreaks";

type MovementBreakCardProps = {
  movement: MovementBreak;
  onDone: () => void;
};

/** A single movement break: speaks the instruction, runs a short countdown,
 * then lets the child confirm with "I did it" — no failure state. */
export function MovementBreakCard({ movement, onDone }: MovementBreakCardProps) {
  const [secondsLeft, setSecondsLeft] = useState(movement.durationSeconds);
  useReadAloud(movement.spokenInstruction);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  return (
    <div className="flex flex-col items-center gap-4 rounded-3xl bg-yellow-50 p-6 text-center">
      <motion.div
        animate={{ rotate: [0, -8, 8, -8, 0] }}
        transition={{ repeat: Infinity, duration: 1.2 }}
        className="text-5xl"
        aria-hidden="true"
      >
        🏁
      </motion.div>
      <p className="text-lg font-bold text-yellow-800">{movement.label}</p>
      {secondsLeft > 0 && <p className="text-3xl font-extrabold text-yellow-600">{secondsLeft}</p>}
      <BigButton label="I did it!" variant="success" onClick={onDone} />
    </div>
  );
}
