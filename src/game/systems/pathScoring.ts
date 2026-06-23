export type TracePoint = { x: number; y: number };

/**
 * A deliberately forgiving heuristic for prewriting practice — this is not
 * pixel-perfect shape recognition. Any earnest attempt that covers roughly
 * the right area and direction should pass, in keeping with errorless
 * learning for a young child still building fine motor control.
 */
export function scoreTracingPath(
  path: TracePoint[],
  targetForm: string,
  targetBounds: { width: number; height: number },
): number {
  if (path.length < 6) return 0;

  const xs = path.map((p) => p.x);
  const ys = path.map((p) => p.y);
  const width = Math.max(...xs) - Math.min(...xs);
  const height = Math.max(...ys) - Math.min(...ys);
  const coverage = Math.min(width / targetBounds.width, 1) * Math.min(height / targetBounds.height, 1);

  switch (targetForm) {
    case "vertical_line":
      return height > width * 1.2 ? Math.max(coverage, 0.7) : coverage * 0.5;
    case "horizontal_line":
      return width > height * 1.2 ? Math.max(coverage, 0.7) : coverage * 0.5;
    case "diagonal_line":
      return width > 10 && height > 10 ? Math.max(coverage, 0.7) : coverage * 0.5;
    case "circle": {
      const start = path[0];
      const end = path[path.length - 1];
      const closed = Math.hypot(end.x - start.x, end.y - start.y) < Math.max(width, height) * 0.5;
      return closed ? Math.max(coverage, 0.7) : coverage * 0.6;
    }
    default:
      return Math.max(coverage, 0.6);
  }
}
