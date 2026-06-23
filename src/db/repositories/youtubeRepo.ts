import { db } from "../db";
import type { YouTubeCacheEntry, YouTubeChannelSetting } from "../../types/youtube";
import { APPROVED_YOUTUBE_CHANNELS } from "../../data/youtubeWhitelist";

export async function getChannelSettings(): Promise<YouTubeChannelSetting[]> {
  const stored = await db.youtubeSettings.toArray();
  const storedIds = new Set(stored.map((setting) => setting.channelId));

  const missingDefaults = APPROVED_YOUTUBE_CHANNELS.filter(
    (channel) => !storedIds.has(channel.channelId),
  ).map((channel) => ({
    channelId: channel.channelId,
    enabled: channel.enabledByDefault,
    updatedAt: Date.now(),
  }));

  return [...stored, ...missingDefaults];
}

export async function setChannelEnabled(channelId: string, enabled: boolean): Promise<void> {
  const existing = await db.youtubeSettings.where("channelId").equals(channelId).first();
  if (existing?.id) {
    await db.youtubeSettings.update(existing.id, { enabled, updatedAt: Date.now() });
    return;
  }
  await db.youtubeSettings.add({ channelId, enabled, updatedAt: Date.now() });
}

export async function getEnabledChannelIds(): Promise<string[]> {
  const settings = await getChannelSettings();
  return settings.filter((setting) => setting.enabled).map((setting) => setting.channelId);
}

export async function cacheVideo(entry: YouTubeCacheEntry): Promise<void> {
  await db.youtubeCache.add(entry);
}

export async function getCachedVideos(skillTag: string): Promise<YouTubeCacheEntry[]> {
  return db.youtubeCache.where("skillTag").equals(skillTag).toArray();
}

export async function markVideoHelpful(id: number, helpful: boolean): Promise<void> {
  await db.youtubeCache.update(id, { helpful });
}
