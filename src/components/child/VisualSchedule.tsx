import { speak } from "../../services/textToSpeechService";
import { useReadAloud } from "../../hooks/useReadAloud";
import { Icon } from "../../utils/icon";
import type { ScheduleItem } from "../../data/visualSchedules";

type VisualScheduleProps = {
  items: ScheduleItem[];
  currentItemId?: string;
  completedIds?: string[];
  onWhatsNext?: () => void;
};

/** Always-visible visual schedule support: shows hello/first/games/move/talk/
 * race/goodbye, marks completed steps, and speaks the current step on load. */
export function VisualSchedule({
  items,
  currentItemId,
  completedIds = [],
  onWhatsNext,
}: VisualScheduleProps) {
  const current = items.find((item) => item.id === currentItemId);
  useReadAloud(current ? `Here is your schedule. Now: ${current.label}.` : null);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap justify-center gap-2 rounded-2xl bg-slate-100 p-3">
        {items.map((item) => {
          const isCurrent = item.id === currentItemId;
          const isComplete = completedIds.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onMouseEnter={() => speak(item.label)}
              onFocus={() => speak(item.label)}
              onClick={() => speak(item.label)}
              aria-current={isCurrent}
              className={`flex w-20 flex-col items-center gap-1 rounded-xl p-2 text-xs font-semibold ${
                isCurrent
                  ? "bg-orange-200 text-orange-800 ring-2 ring-orange-500"
                  : isComplete
                    ? "bg-green-100 text-green-700"
                    : "bg-white text-slate-500"
              }`}
            >
              <Icon name={isComplete ? "check-circle" : item.icon} size={28} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
      {onWhatsNext && (
        <button
          type="button"
          onMouseEnter={() => speak("What's next?")}
          onFocus={() => speak("What's next?")}
          onClick={() => {
            speak("What's next?");
            onWhatsNext();
          }}
          className="text-sm font-semibold text-slate-500 underline"
        >
          What&apos;s next?
        </button>
      )}
    </div>
  );
}
