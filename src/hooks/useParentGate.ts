import { useCallback, useState } from "react";
import { PARENT_GATE_SESSION_KEY, PARENT_GATE_UNLOCK_DURATION_MS } from "../app/constants";

function readUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  const raw = window.sessionStorage.getItem(PARENT_GATE_SESSION_KEY);
  if (!raw) return false;
  const unlockedAt = Number(raw);
  return Date.now() - unlockedAt < PARENT_GATE_UNLOCK_DURATION_MS;
}

/** Tracks whether the parent gate has been passed recently. Unlocking
 * persists for a short window (sessionStorage) so a parent isn't forced
 * to repeat the hold+math challenge for every settings tweak in one
 * sitting, but a fresh app open always re-locks. */
export function useParentGate() {
  const [isUnlocked, setIsUnlocked] = useState(readUnlocked);

  const unlock = useCallback(() => {
    window.sessionStorage.setItem(PARENT_GATE_SESSION_KEY, String(Date.now()));
    setIsUnlocked(true);
  }, []);

  const lock = useCallback(() => {
    window.sessionStorage.removeItem(PARENT_GATE_SESSION_KEY);
    setIsUnlocked(false);
  }, []);

  return { isUnlocked, unlock, lock };
}
