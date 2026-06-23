import { useCallback, useEffect, useState } from "react";
import { useActiveProfileStore } from "../state/activeProfileStore";
import { createProfile, listProfiles, getOrCreateDefaultProfile } from "../db/repositories/profileRepo";
import type { ChildProfile } from "../types/child";

export function useActiveProfile() {
  const { activeProfileId, setActiveProfileId } = useActiveProfileStore();
  const [profiles, setProfiles] = useState<ChildProfile[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      await getOrCreateDefaultProfile("Super Racer", 5);
      const all = await listProfiles();
      if (!cancelled) setProfiles(all);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!profiles || profiles.length === 0) return;
    const stillExists = profiles.some((p) => p.id === activeProfileId);
    if (!stillExists) {
      setActiveProfileId(profiles[0].id!);
    }
  }, [profiles, activeProfileId, setActiveProfileId]);

  const refresh = useCallback(async () => {
    const all = await listProfiles();
    setProfiles(all);
    return all;
  }, []);

  const addProfile = useCallback(
    async (name: string, ageYears: number) => {
      const created = await createProfile(name, ageYears);
      await refresh();
      setActiveProfileId(created.id!);
      return created;
    },
    [refresh, setActiveProfileId],
  );

  const activeProfile = profiles?.find((p) => p.id === activeProfileId) ?? profiles?.[0] ?? null;

  return {
    profile: activeProfile,
    profiles: profiles ?? [],
    loading: profiles === null,
    selectProfile: setActiveProfileId,
    addProfile,
    refresh,
  };
}
