import { motion } from "framer-motion";
import { useReadAloud } from "../../hooks/useReadAloud";
import type { FamilyMember } from "../../data/familyMembers";

type TurnTakingCardProps = {
  player: FamilyMember | { id: "child"; displayName: string; pronunciation: string };
  isChildTurn: boolean;
};

/** Big visual "whose turn" indicator for Two-Player Mode, using each family
 * member's correct pronunciation when speaking their name. */
export function TurnTakingCard({ player, isChildTurn }: TurnTakingCardProps) {
  useReadAloud(`${player.pronunciation}'s turn.`);

  return (
    <motion.div
      key={player.id}
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`flex flex-col items-center gap-2 rounded-3xl p-6 text-center shadow-lg ${
        isChildTurn ? "bg-orange-100" : "bg-sky-100"
      }`}
    >
      <span className="text-sm font-bold uppercase tracking-wide text-slate-500">
        {isChildTurn ? "My Turn" : "Your Turn"}
      </span>
      <span className="text-2xl font-extrabold text-slate-800">{player.displayName}</span>
    </motion.div>
  );
}
