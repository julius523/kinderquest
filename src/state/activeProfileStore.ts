import { create } from "zustand";
import { persist } from "zustand/middleware";

type ActiveProfileState = {
  activeProfileId: number | null;
  setActiveProfileId: (id: number) => void;
};

/** Which child is currently "playing" — shared by Child Mode (who's
 * playing right now) and Parent Mode (whose data the dashboard shows).
 * Persisted so the choice survives a reload, but defaults to the first
 * profile for anyone who never sees/uses the switcher. */
export const useActiveProfileStore = create<ActiveProfileState>()(
  persist(
    (set) => ({
      activeProfileId: null,
      setActiveProfileId: (id) => set({ activeProfileId: id }),
    }),
    { name: "kq_active_profile" },
  ),
);
