import { type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { ParentGate } from "./ParentGate";
import { useParentGate } from "../../hooks/useParentGate";
import { ROUTES } from "../../app/constants";

const TABS = [
  { to: ROUTES.parentDashboard, label: "Dashboard" },
  { to: ROUTES.parentSettings, label: "Settings" },
  { to: ROUTES.parentYouTube, label: "YouTube" },
  { to: ROUTES.printables, label: "Printables" },
  { to: ROUTES.teacherDashboard, label: "Teacher" },
];

/** Every parent/teacher page is wrapped in this layout: it gates access
 * behind the hold+math challenge, then provides shared tab navigation. */
export function ParentLayout({ children }: { children: ReactNode }) {
  const { isUnlocked, unlock } = useParentGate();
  const location = useLocation();

  if (!isUnlocked) {
    return <ParentGate onUnlock={unlock} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="flex gap-2 overflow-x-auto border-b border-slate-200 bg-white p-3">
        {TABS.map((tab) => (
          <Link
            key={tab.to}
            to={tab.to}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ${
              location.pathname === tab.to ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600"
            }`}
          >
            {tab.label}
          </Link>
        ))}
        <Link
          to={ROUTES.childHome}
          className="ml-auto whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold text-slate-400"
        >
          Exit
        </Link>
      </nav>
      <main>{children}</main>
    </div>
  );
}
