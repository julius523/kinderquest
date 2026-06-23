import { useEffect, useState } from "react";
import { ParentLayout } from "../components/parent/ParentLayout";
import { YouTubeChannelToggle } from "../components/parent/YouTubeChannelToggle";
import { useSettingsStore } from "../state/settingsStore";
import { getChannelSettings, setChannelEnabled } from "../db/repositories/youtubeRepo";
import { APPROVED_YOUTUBE_CHANNELS } from "../data/youtubeWhitelist";
import { featureFlags } from "../app/featureFlags";

export default function ParentYouTubePage() {
  const { settings, setSettings } = useSettingsStore();
  const [enabledChannelIds, setEnabledChannelIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    getChannelSettings().then((channelSettings) => {
      setEnabledChannelIds(new Set(channelSettings.filter((c) => c.enabled).map((c) => c.channelId)));
    });
  }, []);

  async function toggleChannel(channelId: string, enabled: boolean) {
    await setChannelEnabled(channelId, enabled);
    setEnabledChannelIds((prev) => {
      const next = new Set(prev);
      if (enabled) next.add(channelId);
      else next.delete(channelId);
      return next;
    });
  }

  return (
    <ParentLayout>
      <div className="mx-auto max-w-2xl p-4">
        <h1 className="mb-2 text-2xl font-bold text-slate-800">YouTube Whitelist</h1>
        <p className="mb-4 text-sm text-slate-500">
          Disabled by default. There is no open search in Child Mode — only videos from channels you
          enable below are ever shown, as an occasional reward or learning break.
        </p>

        {!featureFlags.youtubeApiKey && (
          <p className="mb-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-700">
            No YouTube API key is configured, so videos won't load even if enabled — the rest of the
            app works fine without one.
          </p>
        )}

        <label className="mb-4 flex items-center justify-between rounded-xl bg-white p-3 shadow">
          <span className="font-semibold text-slate-700">Allow YouTube videos in Child Mode</span>
          <input
            type="checkbox"
            checked={settings.youtubeEnabled}
            onChange={(event) => setSettings({ youtubeEnabled: event.target.checked })}
            className="h-5 w-5"
          />
        </label>

        <div className="flex flex-col gap-2">
          {APPROVED_YOUTUBE_CHANNELS.map((channel) => (
            <YouTubeChannelToggle
              key={channel.channelId}
              channel={channel}
              enabled={enabledChannelIds.has(channel.channelId)}
              onToggle={(enabled) => toggleChannel(channel.channelId, enabled)}
            />
          ))}
        </div>
      </div>
    </ParentLayout>
  );
}
