import { lazy, Suspense } from "react";
import { PlayPageFallback } from "../components/layout/PlayPageFallback";

// Phaser is large (~1MB) and only needed once the child actually starts
// playing, so PlayPage is code-split out of the main bundle.
const PlayPage = lazy(() => import("./PlayPage"));

export default function LazyPlayPage() {
  return (
    <Suspense fallback={<PlayPageFallback />}>
      <PlayPage />
    </Suspense>
  );
}
