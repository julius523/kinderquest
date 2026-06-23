import { useReadAloud } from "../../hooks/useReadAloud";
import { speak } from "../../services/textToSpeechService";
import { Icon } from "../../utils/icon";
import { COMMUNICATION_PHRASES, type CommunicationPhrase } from "../../data/communicationPhrases";

type CommunicationBoardProps = {
  onSelect: (phrase: CommunicationPhrase) => void;
  highlightIds?: string[];
  title?: string;
};

/** AAC-style communication board. Every phrase has an icon, text, and spoken
 * audio so the child can always replace frustration behavior with a tap. */
export function CommunicationBoard({
  onSelect,
  highlightIds,
  title = "What do you want to say?",
}: CommunicationBoardProps) {
  useReadAloud(title);

  return (
    <div className="flex flex-col gap-3 rounded-3xl bg-white p-4 shadow-lg">
      <p className="text-center text-lg font-bold text-slate-700">{title}</p>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {COMMUNICATION_PHRASES.map((phrase) => {
          const isHighlighted = !highlightIds || highlightIds.includes(phrase.id);
          return (
            <button
              key={phrase.id}
              type="button"
              onClick={() => {
                speak(phrase.text);
                onSelect(phrase);
              }}
              className={`flex flex-col items-center gap-1 rounded-2xl p-3 text-xs font-semibold transition ${
                isHighlighted
                  ? "bg-sky-100 text-sky-800 ring-2 ring-sky-400"
                  : "bg-slate-50 text-slate-400"
              }`}
            >
              <Icon name={phrase.icon} size={28} />
              <span>{phrase.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
