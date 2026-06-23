import type { ParentInsight } from "../../types/analytics";

const TYPE_STYLES: Record<ParentInsight["type"], string> = {
  what_worked: "bg-green-50 border-green-200 text-green-800",
  why: "bg-sky-50 border-sky-200 text-sky-800",
  home_practice: "bg-amber-50 border-amber-200 text-amber-800",
  next_session: "bg-violet-50 border-violet-200 text-violet-800",
};

const TYPE_LABELS: Record<ParentInsight["type"], string> = {
  what_worked: "What Worked",
  why: "Why It May Be Working",
  home_practice: "Try Outside the App",
  next_session: "Next Session",
};

export function InsightCard({ insight }: { insight: ParentInsight }) {
  return (
    <div className={`rounded-2xl border p-4 ${TYPE_STYLES[insight.type]}`}>
      <p className="text-xs font-semibold uppercase tracking-wide opacity-70">
        {TYPE_LABELS[insight.type]}
      </p>
      <p className="mt-1 font-semibold">{insight.title}</p>
      <p className="mt-1 text-sm opacity-90">{insight.message}</p>
    </div>
  );
}
