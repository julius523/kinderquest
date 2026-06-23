import type { SkillProgressSummary } from "../../services/analyticsEngine";

const SKILL_LABELS: Record<string, string> = {
  communication: "Communication",
  transitions: "Transitions",
  letters: "Letters",
  counting: "Counting",
  prewriting: "Prewriting",
  safe_behavior: "Safe Behavior",
  shapes: "Shapes",
  colors: "Colors",
  listening: "Listening",
  social_skills: "Social Skills",
  story_time: "Story Time",
  calm_body: "Calm Body",
  turn_taking: "Turn Taking",
  speech_sounds: "Speech Sounds",
  movement: "Movement",
  sight_words: "Sight Words",
};

export function SkillProgressCard({ summary }: { summary: SkillProgressSummary }) {
  const needsSupport = summary.supportNeeded >= 3;

  return (
    <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow">
      <div>
        <p className="font-semibold text-slate-700">{SKILL_LABELS[summary.skill] ?? summary.skill}</p>
        <p className="text-xs text-slate-400">
          Level {summary.level} · streak {summary.successStreak}/3
        </p>
      </div>
      {needsSupport && (
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
          Try more visual support
        </span>
      )}
    </div>
  );
}
