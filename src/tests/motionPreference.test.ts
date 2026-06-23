import { describe, expect, it } from "vitest";
import { prefersReducedMotion } from "../game/systems/motionPreference";
import { useSettingsStore } from "../state/settingsStore";

describe("prefersReducedMotion", () => {
  it("reflects the parent's reducedMotionEnabled setting", () => {
    useSettingsStore.setState((state) => ({ settings: { ...state.settings, reducedMotionEnabled: false } }));
    expect(prefersReducedMotion()).toBe(false);

    useSettingsStore.setState((state) => ({ settings: { ...state.settings, reducedMotionEnabled: true } }));
    expect(prefersReducedMotion()).toBe(true);
  });
});
