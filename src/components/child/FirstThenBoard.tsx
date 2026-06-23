import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useReadAloud } from "../../hooks/useReadAloud";
import { Icon } from "../../utils/icon";

export type FirstThenCard = {
  icon: string;
  text: string;
  spokenText?: string;
};

type FirstThenBoardProps = {
  first: FirstThenCard;
  then: FirstThenCard;
};

/** First/Then transition support — shown before any non-preferred or
 * challenging task so the child always knows what comes next. */
export function FirstThenBoard({ first, then }: FirstThenBoardProps) {
  useReadAloud(`First, ${first.spokenText ?? first.text}. Then, ${then.spokenText ?? then.text}.`);

  return (
    <div className="flex items-center justify-center gap-4 rounded-3xl bg-white p-6 shadow-lg">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex w-36 flex-col items-center gap-2 rounded-2xl bg-amber-100 p-4 text-center"
      >
        <span className="text-xs font-bold uppercase tracking-wide text-amber-700">First</span>
        <Icon name={first.icon} size={40} className="text-amber-700" />
        <span className="text-sm font-semibold text-amber-900">{first.text}</span>
      </motion.div>

      <ArrowRight className="text-slate-400" size={32} aria-hidden="true" />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="flex w-36 flex-col items-center gap-2 rounded-2xl bg-emerald-100 p-4 text-center"
      >
        <span className="text-xs font-bold uppercase tracking-wide text-emerald-700">Then</span>
        <Icon name={then.icon} size={40} className="text-emerald-700" />
        <span className="text-sm font-semibold text-emerald-900">{then.text}</span>
      </motion.div>
    </div>
  );
}
