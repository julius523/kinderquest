import { describe, expect, it } from "vitest";
import { scoreTracingPath, type TracePoint } from "../game/systems/pathScoring";

const bounds = { width: 200, height: 200 };

function line(from: TracePoint, to: TracePoint, steps = 10): TracePoint[] {
  return Array.from({ length: steps }, (_, i) => ({
    x: from.x + ((to.x - from.x) * i) / (steps - 1),
    y: from.y + ((to.y - from.y) * i) / (steps - 1),
  }));
}

describe("scoreTracingPath", () => {
  it("scores too-short paths (a single tap) as 0", () => {
    expect(scoreTracingPath([{ x: 0, y: 0 }], "circle", bounds)).toBe(0);
  });

  it("rewards a vertical stroke for a vertical_line target", () => {
    const path = line({ x: 100, y: 0 }, { x: 100, y: 200 });
    expect(scoreTracingPath(path, "vertical_line", bounds)).toBeGreaterThanOrEqual(0.7);
  });

  it("penalizes a horizontal stroke against a vertical_line target", () => {
    const path = line({ x: 0, y: 100 }, { x: 200, y: 100 });
    expect(scoreTracingPath(path, "vertical_line", bounds)).toBeLessThan(0.7);
  });

  it("rewards a closed loop for a circle target", () => {
    const path: TracePoint[] = [];
    for (let i = 0; i <= 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      path.push({ x: 100 + Math.cos(angle) * 80, y: 100 + Math.sin(angle) * 80 });
    }
    expect(scoreTracingPath(path, "circle", bounds)).toBeGreaterThanOrEqual(0.7);
  });

  it("is generous toward any earnest attempt at zigzag/cross/name_tracing", () => {
    const path = line({ x: 20, y: 20 }, { x: 180, y: 180 });
    expect(scoreTracingPath(path, "zigzag", bounds)).toBeGreaterThanOrEqual(0.6);
  });
});
