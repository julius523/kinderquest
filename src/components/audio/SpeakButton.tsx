import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { speak } from "../../services/textToSpeechService";

type SpeakButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  speakText: string;
  children: ReactNode;
};

/** A button that reads its own label aloud on mouse hover, keyboard focus,
 * or tap before firing onClick — every visible word must be readable, and
 * for a mouse/trackpad user that means hovering, not just clicking. */
export function SpeakButton({ speakText, children, onClick, onFocus, onMouseEnter, ...rest }: SpeakButtonProps) {
  return (
    <button
      {...rest}
      onMouseEnter={(event) => {
        speak(speakText);
        onMouseEnter?.(event);
      }}
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
