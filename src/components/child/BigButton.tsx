import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { speak } from "../../services/textToSpeechService";
import { Icon } from "../../utils/icon";

export type BigButtonVariant = "primary" | "secondary" | "success" | "calm" | "danger";

const VARIANT_CLASSES: Record<BigButtonVariant, string> = {
  primary: "bg-orange-500 text-white",
  secondary: "bg-sky-500 text-white",
  success: "bg-green-500 text-white",
  calm: "bg-indigo-400 text-white",
  danger: "bg-rose-500 text-white",
};

type BigButtonProps = {
  label: string;
  spokenText?: string;
  icon?: string;
  variant?: BigButtonVariant;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
};

/** The standard large, icon+text, read-aloud touch target used throughout
 * Child Mode. Every tap and focus speaks the label first. */
export function BigButton({
  label,
  spokenText,
  icon,
  variant = "primary",
  onClick,
  disabled,
  className = "",
  children,
}: BigButtonProps) {
  const announce = () => speak(spokenText ?? label);

  return (
    <motion.button
      type="button"
      disabled={disabled}
      onMouseEnter={announce}
      onFocus={announce}
      onClick={() => {
        announce();
        onClick();
      }}
      whileTap={{ scale: 0.92 }}
      className={`flex min-h-20 min-w-20 flex-col items-center justify-center gap-2 rounded-3xl px-6 py-4 text-xl font-bold shadow-lg disabled:cursor-not-allowed disabled:opacity-50 ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {icon && <Icon name={icon} size={32} aria-hidden="true" />}
      <span>{label}</span>
      {children}
    </motion.button>
  );
}
