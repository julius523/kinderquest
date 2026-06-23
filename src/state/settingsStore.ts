import { create } from "zustand";
import { DEFAULT_APP_SETTINGS, type AppSettings } from "../types/settings";
import { getSettings, updateSettings } from "../db/repositories/settingsRepo";

type SettingsState = {
  settings: AppSettings;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  setSettings: (changes: Partial<AppSettings>) => Promise<void>;
};

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: { ...DEFAULT_APP_SETTINGS },
  hydrated: false,
  hydrate: async () => {
    const settings = await getSettings();
    set({ settings, hydrated: true });
  },
  setSettings: async (changes) => {
    const updated = await updateSettings(changes);
    set({ settings: updated });
  },
}));
