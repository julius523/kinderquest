import { exportActivityResultsAsCsv, exportProgressAsJson } from "../../services/exportService";
import type { ActivityResult, Session } from "../../types/activity";

type ExportButtonsProps = {
  childName: string;
  sessions: Session[];
  results: ActivityResult[];
};

export function ExportButtons({ childName, sessions, results }: ExportButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => exportActivityResultsAsCsv(results, childName)}
        className="rounded-xl bg-slate-700 px-4 py-2 text-sm font-semibold text-white"
      >
        Export CSV
      </button>
      <button
        type="button"
        onClick={() => exportProgressAsJson(childName, sessions, results)}
        className="rounded-xl bg-slate-700 px-4 py-2 text-sm font-semibold text-white"
      >
        Export JSON
      </button>
    </div>
  );
}
