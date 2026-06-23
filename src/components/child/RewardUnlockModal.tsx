import { motion } from "framer-motion";
import { useReadAloud } from "../../hooks/useReadAloud";
import { BigButton } from "./BigButton";
import type { Reward } from "../../types/rewards";

type RewardUnlockModalProps = {
  reward: Reward;
  onContinue: () => void;
};

const CONFETTI_COLORS = ["#ff5a36", "#ffd23f", "#3bb2ff", "#34d399", "#a78bfa"];

export function RewardUnlockModal({ reward, onContinue }: RewardUnlockModalProps) {
  useReadAloud(reward.praiseText);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative flex max-w-sm flex-col items-center gap-4 rounded-3xl bg-white p-8 text-center shadow-2xl"
      >
        {Array.from({ length: 12 }).map((_, index) => (
          <motion.span
            key={index}
            initial={{ y: -20, x: 0, opacity: 1 }}
            animate={{ y: 220, x: (index % 2 === 0 ? 1 : -1) * (20 + index * 6), opacity: 0 }}
            transition={{ duration: 1.4, delay: index * 0.04, repeat: Infinity, repeatDelay: 1 }}
            className="absolute top-0 h-3 w-3 rounded-full"
            style={{ backgroundColor: CONFETTI_COLORS[index % CONFETTI_COLORS.length], left: "50%" }}
            aria-hidden="true"
          />
        ))}

        <motion.div
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.6 }}
          className="text-6xl"
          aria-hidden="true"
        >
          🏆
        </motion.div>
        <h2 className="text-2xl font-extrabold text-orange-600">{reward.name}</h2>
        <p className="text-lg font-semibold text-slate-700">{reward.praiseText}</p>
        <BigButton label="Next" variant="primary" onClick={onContinue} />
      </motion.div>
    </div>
  );
}
