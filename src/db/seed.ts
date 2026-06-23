import { getOrCreateDefaultProfile } from "./repositories/profileRepo";
import { getSettings } from "./repositories/settingsRepo";
import type { ChildProfile } from "../types/child";
import type { AppSettings } from "../types/settings";

export async function ensureSeeded(
  defaultName = "Super Racer",
  defaultAge = 5,
): Promise<{ profile: ChildProfile; settings: AppSettings }> {
  const profile = await getOrCreateDefaultProfile(defaultName, defaultAge);
  const settings = await getSettings();
  return { profile, settings };
}
