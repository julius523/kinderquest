import { LifeBuoy } from "lucide-react";
import { speak } from "../../services/textToSpeechService";

type ParentHelpButtonProps = {
  onRequestHelp: () => void;
};

/** Always-available "grown-up can help" button. The app never prompts
 * hand-over-hand support itself — it only offers to bring a caregiver in. */
export function ParentHelpButton({ onRequestHelp }: ParentHelpButtonProps) {
  return (
    <button
      type="button"
      aria-label="Grown-up can help"
      onMouseEnter={() => speak("Grown-up can help.")}
      onFocus={() => speak("Grown-up can help.")}
      onClick={() => {
        speak("Grown-up can help.");
        onRequestHelp();
      }}
      className="fixed bottom-4 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-slate-700 text-white shadow-lg active:scale-90"
    >
      <LifeBuoy size={26} />
    </button>
  );
}
