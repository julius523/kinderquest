import { useEffect, useState } from "react";
import { ParentLayout } from "../components/parent/ParentLayout";
import { PrintableView } from "../components/parent/PrintableView";
import { ExportButtons } from "../components/parent/ExportButtons";
import { getOrCreateDefaultProfile } from "../db/repositories/profileRepo";
import { getSessionsForChild } from "../db/repositories/sessionRepo";
import { getActivityResultsForChild, getAllSkillProgress, getRewardsForChild } from "../db/repositories/activityRepo";
import { summarizeSkillProgress } from "../services/analyticsEngine";
import { generateInsights } from "../services/insightEngine";
import {
  getCalmChoiceBoardPrintable,
  getCommunicationBoardPrintable,
  getFirstThenCardPrintable,
  getHomePracticeSheetPrintable,
  getRewardChartPrintable,
  getTeacherSummaryPrintable,
  getTurnTakingCardsPrintable,
  getVisualSchedulePrintable,
  type PrintableDoc,
} from "../services/printableService";
import type { ChildProfile } from "../types/child";
import type { ActivityResult, Session } from "../types/activity";

type PrintableOption = {
  id: string;
  label: string;
  build: (data: PageData) => PrintableDoc;
};

const PRINTABLE_OPTIONS: PrintableOption[] = [
  { id: "schedule", label: "Visual Schedule", build: () => getVisualSchedulePrintable() },
  {
    id: "first_then",
    label: "First/Then Card",
    build: () => getFirstThenCardPrintable("Trace 3 lines", "Race Super Racer"),
  },
  { id: "comm_board", label: "Communication Board", build: () => getCommunicationBoardPrintable() },
  { id: "calm_board", label: "Calm Body Choices", build: () => getCalmChoiceBoardPrintable() },
  { id: "turn_taking", label: "Turn Taking Cards", build: () => getTurnTakingCardsPrintable() },
  {
    id: "reward_chart",
    label: "Reward Chart",
    build: (data) => getRewardChartPrintable(data.rewardIds),
  },
  { id: "home_practice", label: "Home Practice Sheet", build: () => getHomePracticeSheetPrintable() },
  {
    id: "teacher_summary",
    label: "Teacher Summary",
    build: (data) =>
      getTeacherSummaryPrintable(data.profile.name, summarizeSkillProgress(data.skillProgress), data.insights),
  },
];

type PageData = {
  profile: ChildProfile;
  sessions: Session[];
  results: ActivityResult[];
  skillProgress: Awaited<ReturnType<typeof getAllSkillProgress>>;
  insights: ReturnType<typeof generateInsights>;
  rewardIds: string[];
};

export default function PrintablesPage() {
  const [data, setData] = useState<PageData | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const profile = await getOrCreateDefaultProfile("Super Racer", 5);
      if (!profile.id) return;

      const [sessions, results, skillProgress, rewards] = await Promise.all([
        getSessionsForChild(profile.id),
        getActivityResultsForChild(profile.id),
        getAllSkillProgress(profile.id),
        getRewardsForChild(profile.id),
      ]);

      setData({
        profile,
        sessions,
        results,
        skillProgress,
        insights: generateInsights(profile.id, results),
        rewardIds: rewards.map((r) => r.rewardId),
      });
    })();
  }, []);

  const activeOption = PRINTABLE_OPTIONS.find((option) => option.id === activeId);

  return (
    <ParentLayout>
      <div className="mx-auto max-w-3xl p-4">
        <h1 className="mb-4 text-2xl font-bold text-slate-800 print:hidden">Printables</h1>

        {activeOption && data ? (
          <PrintableView doc={activeOption.build(data)} onBack={() => setActiveId(null)} />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {PRINTABLE_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setActiveId(option.id)}
                  disabled={!data}
                  className="rounded-2xl bg-white p-4 text-left text-sm font-semibold text-slate-700 shadow disabled:opacity-50"
                >
                  {option.label}
                </button>
              ))}
            </div>

            {data && (
              <div className="mt-6">
                <h2 className="mb-2 text-lg font-bold text-slate-700">Export Progress</h2>
                <ExportButtons childName={data.profile.name} sessions={data.sessions} results={data.results} />
              </div>
            )}
          </>
        )}
      </div>
    </ParentLayout>
  );
}
