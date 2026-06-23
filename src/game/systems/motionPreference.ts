import { useSettingsStore } from "../../state/settingsStore";

/** Read directly from the store (not a hook) since Phaser scenes are
 * plain classes, not React components. */
export function prefersReducedMotion(): boolean {
  return useSettingsStore.getState().settings.reducedMotionEnabled;
}
