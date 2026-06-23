import { useEffect, useMemo, useState } from "react";
import { ParentLayout } from "../components/parent/ParentLayout";
import { DashboardCard } from "../components/parent/DashboardCard";
import { SkillProgressCard } from "../components/parent/SkillProgressCard";
import { InsightCard } from "../components/parent/InsightCard";
import { SessionTimeline } from "../components/parent/SessionTimeline";
import { InterestRadar } from "../components/parent/InterestRadar";
import { getOrCreateDefaultProfile } from "../db/repositories/profileRepo";
import { getSessionsForChild } from "../db/repositories/sessionRepo";
import {
  getActivityResultsForChild,
  getAllInterests,
  getAllSkillProgress,
} from "../db/repositories/activityRepo";
import { getCommunicationEventsForChild } from "../db/repositories/analyticsRepo";
import { computeSessionSummary, summarizeSkillProgress } from "../services/analyticsEngine";
import { generateInsights } from "../services/insightEngine";
import type { ChildProfile } from "../types/child";
import type { Session, ActivityResult } from "../types/activity";
import type { InterestRecord, SkillProgressRecord } from "../types/db";
import type { CommunicationEvent } from "../types/speech";

type DashboardTab = "today" | "skills" | "communication" | "behavior" | "interests" | "what_worked";

const TABS: { id: DashboardTab; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "skills", label: "Skills" },
  { id: "communication", label: "Communication" },
  { id: "behavior", label: "Behavior" },
  { id: "interests", label: "Interests" },
  { id: "what_worked", label: "What Worked" },
];

type DashboardData = {
  profile: ChildProfile;
  sessions: Session[];
  results: ActivityResult[];
  skillProgress: SkillProgressRecord[];
  interests: InterestRecord[];
  communicationEvents: CommunicationEvent[];
};

function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const profile = await getOrCreateDefaultProfile("Super Racer", 5);
        if (!profile.id || cancelled) return;

        const [sessions, results, skillProgress, interests, communicationEvents] = await Promise.all([
          getSessionsForChild(profile.id),
          getActivityResultsForChild(profile.id),
          getAllSkillProgress(profile.id),
          getAllInterests(profile.id),
          getCommunicationEventsForChild(profile.id),
        ]);

        if (cancelled) return;
        setData({ profile, sessions, results, skillProgress, interests, communicationEvents });
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load parent dashboard data", err);
          setError(err instanceof Error ? err.message : "Failed to load dashboard data.");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, error };
}

export default function ParentDashboardPage() {
  const [tab, setTab] = useState<DashboardTab>("today");
  const { data, error } = useDashboardData();

  return (
    <ParentLayout>
      <div className="mx-auto max-w-3xl p-4">
        <h1 className="mb-4 text-2xl font-bold text-slate-800">Parent Dashboard</h1>

        <div className="mb-4 flex gap-2 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ${
                tab === t.id ? "bg-orange-500 text-white" : "bg-white text-slate-600 shadow"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {error ? (
          <p className="text-rose-500">{error}</p>
        ) : !data ? (
          <p className="text-slate-400">Loading…</p>
        ) : (
          <DashboardTabContent tab={tab} data={data} />
        )}
      </div>
    </ParentLayout>
  );
}

function DashboardTabContent({ tab, data }: { tab: DashboardTab; data: DashboardData }) {
  const latestSession = data.sessions[0];
  const todaySummary = useMemo(() => {
    if (!latestSession) return null;
    const sessionResults = data.results.filter((r) => r.sessionId === latestSession.id);
    return computeSessionSummary(latestSession, sessionResults);
  }, [latestSession, data.results]);

  const skillSummaries = useMemo(() => summarizeSkillProgress(data.skillProgress), [data.skillProgress]);
  const insights = useMemo(
    () => (data.profile.id ? generateInsights(data.profile.id, data.results) : []),
    [data.profile.id, data.results],
  );

  if (tab === "today") {
    if (!todaySummary) {
      return <p className="text-slate-400">No sessions yet — once he plays, today's summary shows up here.</p>;
    }
    return (
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <DashboardCard label="Minutes Played" value={todaySummary.minutesPlayed.toFixed(0)} />
          <DashboardCard
            label="Activities"
            value={`${todaySummary.activitiesCompleted}/${todaySummary.activitiesAttempted}`}
          />
          <DashboardCard label="Engagement Score" value={String(todaySummary.engagementScore)} />
          <DashboardCard label="Best Skill" value={todaySummary.bestSkill ?? "—"} />
          <DashboardCard label="Hardest Skill" value={todaySummary.hardestSkill ?? "—"} />
          <DashboardCard label="Rewards Earned" value={String(todaySummary.rewardsUnlockedCount)} />
          <DashboardCard label="Calm Breaks Used" value={String(todaySummary.calmBreaksUsed)} />
          <DashboardCard label="Movement Breaks Used" value={String(todaySummary.movementBreaksUsed)} />
        </div>
        <h2 className="mt-2 text-lg font-bold text-slate-700">Recent Sessions</h2>
        <SessionTimeline sessions={data.sessions} />
      </div>
    );
  }

  if (tab === "skills") {
    if (skillSummaries.length === 0) {
      return <p className="text-slate-400">Skill progress appears after he completes a few activities.</p>;
    }
    return (
      <div className="flex flex-col gap-2">
        {skillSummaries.map((summary) => (
          <SkillProgressCard key={summary.skill} summary={summary} />
        ))}
      </div>
    );
  }

  if (tab === "communication") {
    if (data.communicationEvents.length === 0) {
      return <p className="text-slate-400">Communication board and speech attempts show up here.</p>;
    }
    const byMode = data.communicationEvents.reduce<Record<string, number>>((acc, event) => {
      acc[event.responseMode] = (acc[event.responseMode] ?? 0) + 1;
      return acc;
    }, {});
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Object.entries(byMode).map(([mode, count]) => (
          <DashboardCard key={mode} label={mode.replace("_", " ")} value={String(count)} />
        ))}
      </div>
    );
  }

  if (tab === "behavior") {
    const totals = data.sessions.reduce(
      (acc, session) => ({
        frustrationMarkers: acc.frustrationMarkers + session.regulationSummary.frustrationMarkers,
        rapidTapBursts: acc.rapidTapBursts + session.regulationSummary.rapidTapBursts,
        calmBreaksUsed: acc.calmBreaksUsed + session.regulationSummary.calmBreaksUsed,
        movementBreaksUsed: acc.movementBreaksUsed + session.regulationSummary.movementBreaksUsed,
      }),
      { frustrationMarkers: 0, rapidTapBursts: 0, calmBreaksUsed: 0, movementBreaksUsed: 0 },
    );
    return (
      <div className="grid grid-cols-2 gap-3">
        <DashboardCard label="Frustration Markers" value={String(totals.frustrationMarkers)} />
        <DashboardCard label="Rapid Tap Bursts" value={String(totals.rapidTapBursts)} />
        <DashboardCard label="Calm Breaks Used" value={String(totals.calmBreaksUsed)} />
        <DashboardCard label="Movement Breaks Used" value={String(totals.movementBreaksUsed)} />
      </div>
    );
  }

  if (tab === "interests") {
    return <InterestRadar interests={data.interests} />;
  }

  if (insights.length === 0) {
    return <p className="text-slate-400">Insights build up after a few sessions of real play.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {insights.map((insight, index) => (
        <InsightCard key={index} insight={insight} />
      ))}
    </div>
  );
}
