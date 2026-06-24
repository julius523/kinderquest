import { Volume2 } from "lucide-react";
import { speak } from "../../services/textToSpeechService";
import { useReadAloud } from "../../hooks/useReadAloud";

type ReadAloudTextProps = {
  text: string;
  spokenText?: string;
  className?: string;
  showRepeatButton?: boolean;
  as?: "p" | "h1" | "h2" | "span";
};

/** Displays an instruction and speaks it once on mount, with an optional
 * repeat button so the child can hear it again without help. */
export function ReadAloudText({
  text,
  spokenText,
  className,
  showRepeatButton = true,
  as = "p",
}: ReadAloudTextProps) {
  const Tag = as;
  useReadAloud(spokenText ?? text);

  return (
    <div className="flex items-center justify-center gap-3">
      <Tag className={className}>{text}</Tag>
      {showRepeatButton && (
        <button
          type="button"
          aria-label="Repeat instruction"
          onMouseEnter={() => speak(spokenText ?? text)}
          onClick={() => speak(spokenText ?? text)}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600 active:scale-90"
        >
          <Volume2 size={24} />
        </button>
      )}
    </div>
  );
}
