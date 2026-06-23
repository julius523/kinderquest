import { lazy, Suspense } from "react";
import type { RouteObject } from "react-router-dom";
import { ROUTES } from "./constants";
import ChildHomePage from "../pages/ChildHomePage";
import ParentGatePage from "../pages/ParentGatePage";
import ParentDashboardPage from "../pages/ParentDashboardPage";
import ParentSettingsPage from "../pages/ParentSettingsPage";
import ParentYouTubePage from "../pages/ParentYouTubePage";
import ParentSessionPage from "../pages/ParentSessionPage";
import TeacherDashboardPage from "../pages/TeacherDashboardPage";
import PrintablesPage from "../pages/PrintablesPage";

// Phaser is large (~1MB) and only needed once the child actually starts
// playing, so PlayPage is code-split out of the main bundle.
const PlayPage = lazy(() => import("../pages/PlayPage"));

function PlayPageFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white">
      <p className="text-xl text-slate-500">Loading Super Racer&apos;s garage…</p>
    </main>
  );
}

export const routes: RouteObject[] = [
  { path: ROUTES.childHome, element: <ChildHomePage /> },
  {
    path: ROUTES.play,
    element: (
      <Suspense fallback={<PlayPageFallback />}>
        <PlayPage />
      </Suspense>
    ),
  },
  { path: ROUTES.parentGate, element: <ParentGatePage /> },
  { path: ROUTES.parentDashboard, element: <ParentDashboardPage /> },
  { path: ROUTES.parentSettings, element: <ParentSettingsPage /> },
  { path: ROUTES.parentYouTube, element: <ParentYouTubePage /> },
  { path: ROUTES.parentSession, element: <ParentSessionPage /> },
  { path: ROUTES.teacherDashboard, element: <TeacherDashboardPage /> },
  { path: ROUTES.printables, element: <PrintablesPage /> },
];
