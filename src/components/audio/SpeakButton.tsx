import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { speak } from "../../services/textToSpeechService";

type SpeakButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  speakText: string;
  children: ReactNode;
};

/** A button that reads its own label aloud on focus/tap before firing onClick,
 * per the rule that every button must be readable. */
export function SpeakButton({ speakText, children, onClick, onFocus, ...rest }: SpeakButtonProps) {
  return (
    <button
      {...rest}
      onFocus={(event) => {
        speak(speakText);
        onFocus?.(event);
      }}
      onClick={(event) => {
        speak(speakText);
        onClick?.(event);
      }}
    >
      {children}
    </button>
  );
}
