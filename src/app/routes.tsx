import type { RouteObject } from "react-router-dom";
import { ROUTES } from "./constants";
import ChildHomePage from "../pages/ChildHomePage";
import LazyPlayPage from "../pages/LazyPlayPage";
import ParentGatePage from "../pages/ParentGatePage";
import ParentDashboardPage from "../pages/ParentDashboardPage";
import ParentSettingsPage from "../pages/ParentSettingsPage";
import ParentYouTubePage from "../pages/ParentYouTubePage";
import ParentSessionPage from "../pages/ParentSessionPage";
import TeacherDashboardPage from "../pages/TeacherDashboardPage";
import PrintablesPage from "../pages/PrintablesPage";

export const routes: RouteObject[] = [
  { path: ROUTES.childHome, element: <ChildHomePage /> },
  { path: ROUTES.play, element: <LazyPlayPage /> },
  { path: ROUTES.parentGate, element: <ParentGatePage /> },
  { path: ROUTES.parentDashboard, element: <ParentDashboardPage /> },
  { path: ROUTES.parentSettings, element: <ParentSettingsPage /> },
  { path: ROUTES.parentYouTube, element: <ParentYouTubePage /> },
  { path: ROUTES.parentSession, element: <ParentSessionPage /> },
  { path: ROUTES.teacherDashboard, element: <TeacherDashboardPage /> },
  { path: ROUTES.printables, element: <PrintablesPage /> },
];
