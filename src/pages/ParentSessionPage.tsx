import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ParentLayout } from "../components/parent/ParentLayout";
import { DashboardCard } from "../components/parent/DashboardCard";
import { getSession } from "../db/repositories/sessionRepo";
import { getActivityResultsForSession } from "../db/repositories/activityRepo";
import { computeSessionSummary } from "../services/analyticsEngine";
import type { Session, ActivityResult } from "../types/activity";

export default function ParentSessionPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [session, setSession] = useState<Session | null>(null);
  const [results, setResults] = useState<ActivityResult[]>([]);

  useEffect(() => {
    const id = Number(sessionId);
    if (!id) return;

    (async () => {
      const [foundSession, foundResults] = await Promise.all([
        getSession(id),
        getActivityResultsForSession(id),
      ]);
      setSession(foundSession ?? null);
      setResults(foundResults);
    })();
  }, [sessionId]);

  if (!session) {
    return (
      <ParentLayout>
        <main className="p-8">
          <p className="text-slate-400">Session not found.</p>
        </main>
      </ParentLayout>
    );
  }

  const summary = computeSessionSummary(session, results);

  return (
    <ParentLayout>
      <div className="mx-auto max-w-2xl p-4">
        <h1 className="mb-4 text-2xl font-bold text-slate-800">
          Session — {new Date(session.startedAt).toLocaleString()}
        </h1>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <DashboardCard label="Minutes Played" value={summary.minutesPlayed.toFixed(0)} />
          <DashboardCard
            label="Activities"
            value={`${summary.activitiesCompleted}/${summary.activitiesAttempted}`}
          />
          <DashboardCard label="Engagement" value={String(summary.engagementScore)} />
        </div>

        <h2 className="mt-6 text-lg font-bold text-slate-700">Activities</h2>
        <ul className="mt-2 flex flex-col gap-2">
          {results.map((result) => (
            <li key={result.id} className="rounded-xl bg-white p-3 text-sm shadow">
              <span className="font-semibold text-slate-700">{result.activityId}</span>
              <span className="ml-2 text-slate-400">
                {result.completed ? "completed" : "in progress"} · prompt: {result.promptLevelUsed}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </ParentLayout>
  );
}
