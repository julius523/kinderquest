import { db } from "../db";
import { DEFAULT_APP_SETTINGS, type AppSettings } from "../../types/settings";

const SETTINGS_KEY = "default";

export async function getSettings(): Promise<AppSettings> {
  const existing = await db.appSettings.where("key").equals(SETTINGS_KEY).first();
  if (existing) return existing;

  const fresh: AppSettings = { ...DEFAULT_APP_SETTINGS, updatedAt: Date.now() };
  const id = await db.appSettings.add(fresh);
  return { ...fresh, id };
}

export async function updateSettings(changes: Partial<AppSettings>): Promise<AppSettings> {
  const current = await getSettings();
  const updated: AppSettings = { ...current, ...changes, updatedAt: Date.now() };
  await db.appSettings.put(updated);
  return updated;
}
