import { afterEach, describe, expect, it, vi } from "vitest";
import { popIn, shake, celebrate } from "../game/systems/feedback";
import { useSettingsStore } from "../state/settingsStore";

type SceneArg = Parameters<typeof popIn>[0];
type TargetArg = Parameters<typeof popIn>[1];

function mockScene() {
  const tweens = { add: vi.fn() };
  return { scene: { tweens } as unknown as SceneArg, tweens };
}

function mockTarget(overrides: Record<string, unknown> = {}) {
  const setScale = vi.fn();
  const obj = { setScale, x: 100, ...overrides };
  return { target: obj as unknown as TargetArg, setScale, raw: obj };
}

afterEach(() => {
  useSettingsStore.setState((state) => ({
    settings: { ...state.settings, reducedMotionEnabled: false },
  }));
});

describe("popIn", () => {
  it("animates from scale 0 with a Back.easeOut tween by default", () => {
    const { scene, tweens } = mockScene();
    const { target, setScale } = mockTarget();

    popIn(scene, target);

    expect(setScale).toHaveBeenCalledWith(0);
    expect(tweens.add).toHaveBeenCalledWith(
      expect.objectContaining({ targets: target, scale: 1, ease: "Back.easeOut" }),
    );
  });

  it("supports a custom final scale", () => {
    const { scene, tweens } = mockScene();
    const { target } = mockTarget();

    popIn(scene, target, 100, 1.5);

    expect(tweens.add).toHaveBeenCalledWith(expect.objectContaining({ scale: 1.5, delay: 100 }));
  });

  it("skips the animation and jumps straight to final scale when reduced motion is on", () => {
    useSettingsStore.setState((state) => ({ settings: { ...state.settings, reducedMotionEnabled: true } }));
    const { scene, tweens } = mockScene();
    const { target, setScale } = mockTarget();

    popIn(scene, target, 0, 1.2);

    expect(setScale).toHaveBeenCalledWith(1.2);
    expect(tweens.add).not.toHaveBeenCalled();
  });
});

describe("shake", () => {
  it("tweens x back and forth around the original position", () => {
    const { scene, tweens } = mockScene();
    const { target } = mockTarget({ x: 250 });

    shake(scene, target);

    expect(tweens.add).toHaveBeenCalledWith(expect.objectContaining({ targets: target, yoyo: true, repeat: 3 }));
  });

  it("does nothing when reduced motion is on", () => {
    useSettingsStore.setState((state) => ({ settings: { ...state.settings, reducedMotionEnabled: true } }));
    const { scene, tweens } = mockScene();
    const { target } = mockTarget();

    shake(scene, target);

    expect(tweens.add).not.toHaveBeenCalled();
  });
});

describe("celebrate", () => {
  it("pulses scale up and back down", () => {
    const { scene, tweens } = mockScene();
    const { target } = mockTarget();

    celebrate(scene, target);

    expect(tweens.add).toHaveBeenCalledWith(expect.objectContaining({ targets: target, scale: 1.25, yoyo: true }));
  });

  it("does nothing when reduced motion is on", () => {
    useSettingsStore.setState((state) => ({ settings: { ...state.settings, reducedMotionEnabled: true } }));
    const { scene, tweens } = mockScene();
    const { target } = mockTarget();

    celebrate(scene, target);

    expect(tweens.add).not.toHaveBeenCalled();
  });
});
