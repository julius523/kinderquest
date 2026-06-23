export const APP_NAME = "Kinder Quest";

export const ROUTES = {
  childHome: "/",
  play: "/play",
  parentGate: "/parent-gate",
  parentDashboard: "/parent",
  parentSettings: "/parent/settings",
  parentYouTube: "/parent/youtube",
  parentSession: "/parent/session/:sessionId",
  teacherDashboard: "/teacher",
  printables: "/printables",
} as const;

export function parentSessionPath(sessionId: number | string): string {
  return `/parent/session/${sessionId}`;
}

export const PARENT_GATE_SESSION_KEY = "kq_parent_gate_unlocked_at";
export const PARENT_GATE_UNLOCK_DURATION_MS = 10 * 60 * 1000;
