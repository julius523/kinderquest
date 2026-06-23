import type { ActivityResult, Session } from "../types/activity";

function triggerDownload(filename: string, content: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

const CSV_COLUMNS: { key: keyof ActivityResult; label: string }[] = [
  { key: "activityId", label: "activity" },
  { key: "skill", label: "skill" },
  { key: "startedAt", label: "started_at" },
  { key: "completed", label: "completed" },
  { key: "attempts", label: "attempts" },
  { key: "correctAttempts", label: "correct_attempts" },
  { key: "accuracy", label: "accuracy" },
  { key: "promptLevelUsed", label: "prompt_level" },
  { key: "responseMode", label: "response_mode" },
];

function csvEscape(value: unknown): string {
  const text = String(value ?? "");
  if (text.includes(",") || text.includes('"') || text.includes("\n")) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export function buildActivityResultsCsv(results: ActivityResult[]): string {
  const header = CSV_COLUMNS.map((c) => c.label).join(",");
  const rows = results.map((result) =>
    CSV_COLUMNS.map((c) => csvEscape(result[c.key])).join(","),
  );
  return [header, ...rows].join("\n");
}

export function exportActivityResultsAsCsv(results: ActivityResult[], childName: string): void {
  const csv = buildActivityResultsCsv(results);
  triggerDownload(`${childName.replace(/\s+/g, "_")}_progress.csv`, csv, "text/csv");
}

export function exportProgressAsJson(
  childName: string,
  sessions: Session[],
  results: ActivityResult[],
): void {
  const payload = JSON.stringify({ childName, exportedAt: new Date().toISOString(), sessions, results }, null, 2);
  triggerDownload(`${childName.replace(/\s+/g, "_")}_progress.json`, payload, "application/json");
}
