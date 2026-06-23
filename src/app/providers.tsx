import { type ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { useSettingsStore } from "../state/settingsStore";

export function AppProviders({ children }: { children: ReactNode }) {
  const reducedMotionEnabled = useSettingsStore((state) => state.settings.reducedMotionEnabled);

  return (
    <MotionConfig reducedMotion={reducedMotionEnabled ? "always" : "user"}>
      <BrowserRouter>{children}</BrowserRouter>
    </MotionConfig>
  );
}
