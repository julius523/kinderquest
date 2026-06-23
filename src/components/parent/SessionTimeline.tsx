import { format } from "date-fns";
import type { Session } from "../../types/activity";

export function SessionTimeline({ sessions }: { sessions: Session[] }) {
  if (sessions.length === 0) {
    return <p className="text-sm text-slate-400">No sessions yet — once he plays, sessions show up here.</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {sessions.map((session) => (
        <li
          key={session.id}
          className="flex items-center justify-between rounded-xl bg-white p-3 text-sm shadow"
        >
          <span className="text-slate-600">{format(session.startedAt, "MMM d, h:mm a")}</span>
          <span className="text-slate-500">{session.completedActivities} activities</span>
          <span className="font-semibold text-slate-700">Engagement {session.engagementScore}</span>
        </li>
      ))}
    </ul>
  );
}
