import { db } from "../db";
import { createDefaultChildProfile, type ChildProfile } from "../../types/child";

export async function createProfile(name: string, ageYears: number): Promise<ChildProfile> {
  const profile = createDefaultChildProfile(name, ageYears);
  const id = await db.childProfiles.add(profile);
  return { ...profile, id };
}

export async function getProfile(id: number): Promise<ChildProfile | undefined> {
  return db.childProfiles.get(id);
}

export async function getDefaultProfile(): Promise<ChildProfile | undefined> {
  return db.childProfiles.orderBy("createdAt").first();
}

/**
 * Atomic check-then-insert in a single readwrite transaction, so two
 * concurrent callers (e.g. App's seed effect and a page's own data-loading
 * effect, which can both fire under React StrictMode's dev double-invoke)
 * can never both insert a profile.
 */
export async function getOrCreateDefaultProfile(
  name: string,
  ageYears: number,
): Promise<ChildProfile> {
  return db.transaction("rw", db.childProfiles, async () => {
    const existing = await getDefaultProfile();
    if (existing) return existing;
    return createProfile(name, ageYears);
  });
}

export async function updateProfile(
  id: number,
  changes: Partial<ChildProfile>,
): Promise<void> {
  await db.childProfiles.update(id, { ...changes, updatedAt: Date.now() });
}

export async function deleteProfile(id: number): Promise<void> {
  await db.childProfiles.delete(id);
}

export async function listProfiles(): Promise<ChildProfile[]> {
  return db.childProfiles.toArray();
}
