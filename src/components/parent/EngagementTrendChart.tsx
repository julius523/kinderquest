import type { Session } from "../../types/activity";

const WIDTH = 600;
const HEIGHT = 120;
const PADDING = 16;

/** A minimal hand-rolled SVG line chart — no charting library needed for
 * one sparkline. Plots engagement score across the most recent sessions,
 * oldest to newest, so a parent can see whether things are trending up. */
export function EngagementTrendChart({ sessions }: { sessions: Session[] }) {
  const ordered = [...sessions].sort((a, b) => a.startedAt - b.startedAt).slice(-12);

  if (ordered.length < 2) {
    return (
      <p className="text-sm text-slate-400">
        Trends appear once there are at least two sessions to compare.
      </p>
    );
  }

  const innerWidth = WIDTH - PADDING * 2;
  const innerHeight = HEIGHT - PADDING * 2;
  const stepX = innerWidth / (ordered.length - 1);

  const points = ordered.map((session, index) => {
    const x = PADDING + index * stepX;
    const y = PADDING + innerHeight * (1 - session.engagementScore / 100);
    return { x, y, score: session.engagementScore };
  });

  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const first = ordered[0].engagementScore;
  const last = ordered[ordered.length - 1].engagementScore;
  const trend = last > first ? "up" : last < first ? "down" : "flat";
  const trendColor = trend === "up" ? "text-green-600" : trend === "down" ? "text-rose-500" : "text-slate-500";
  const trendLabel = trend === "up" ? "Trending up" : trend === "down" ? "Trending down" : "Holding steady";

  return (
    <div>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label="Engagement score trend">
        <line x1={PADDING} y1={PADDING} x2={PADDING} y2={HEIGHT - PADDING} stroke="#e2e8f0" />
        <line x1={PADDING} y1={HEIGHT - PADDING} x2={WIDTH - PADDING} y2={HEIGHT - PADDING} stroke="#e2e8f0" />
        <path d={path} fill="none" stroke="#fb923c" strokeWidth={3} />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={4} fill="#fb923c" />
        ))}
      </svg>
      <p className={`text-sm font-semibold ${trendColor}`}>
        {trendLabel} — {first} → {last} over the last {ordered.length} sessions
      </p>
    </div>
  );
}
