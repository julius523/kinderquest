import type { InterestRecord } from "../../types/db";

function titleCase(tag: string): string {
  return tag
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/** A simple ranked bar list of interest scores — not a literal radar
 * chart, since pulling in a charting library for one widget isn't worth
 * the dependency weight in a child-facing PWA. */
export function InterestRadar({ interests }: { interests: InterestRecord[] }) {
  if (interests.length === 0) {
    return <p className="text-sm text-slate-400">Interests build up as he plays more activities.</p>;
  }

  const sorted = [...interests].sort((a, b) => b.score - a.score);
  const maxScore = Math.max(...sorted.map((i) => i.score), 1);

  return (
    <div className="flex flex-col gap-2">
      {sorted.map((interest) => (
        <div key={interest.tag} className="flex items-center gap-3">
          <span className="w-28 shrink-0 text-sm text-slate-600">{titleCase(interest.tag)}</span>
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-orange-400"
              style={{ width: `${Math.max(0, (interest.score / maxScore) * 100)}%` }}
            />
          </div>
          <span className="w-8 text-right text-xs text-slate-400">{interest.score}</span>
        </div>
      ))}
    </div>
  );
}
