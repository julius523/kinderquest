import { featureFlags } from "../app/featureFlags";
import { useSettingsStore } from "../state/settingsStore";
import { cacheVideo, getCachedVideos, getEnabledChannelIds } from "../db/repositories/youtubeRepo";
import type { YouTubeVideoResult } from "../types/youtube";
import type { SkillName } from "../types/game";

const SKILL_SEARCH_TERMS: Partial<Record<SkillName, string>> = {
  letters: "preschool letter sounds",
  counting: "preschool counting",
  colors: "preschool colors",
  shapes: "preschool shapes",
  communication: "preschool speech words",
  calm_body: "kids breathing calm body",
  movement: "kids movement break",
  social_skills: "preschool sharing taking turns",
};

export function buildSafeVideoQuery(skill: SkillName, interest?: string): string {
  const base = SKILL_SEARCH_TERMS[skill] ?? "preschool learning";
  return interest ? `${base} ${interest}` : base;
}

export function isYouTubeEnabled(): boolean {
  return useSettingsStore.getState().settings.youtubeEnabled;
}

type YouTubeSearchResponse = {
  items?: {
    id: { videoId: string };
    snippet: {
      title: string;
      channelId: string;
      thumbnails: { medium?: { url: string }; default?: { url: string } };
    };
  }[];
};

/**
 * Fetches videos from parent-approved channels only — the channelId is
 * sent as a request parameter, so results can never include a channel
 * outside the whitelist. Disabled entirely unless the parent has turned
 * YouTube on, and works fine (returns cached/empty results) with no API
 * key configured.
 */
export async function fetchApprovedVideos(
  skill: SkillName,
  interest?: string,
): Promise<YouTubeVideoResult[]> {
  if (!isYouTubeEnabled()) return [];

  const cached = await getCachedVideos(skill);
  if (cached.length > 0) {
    return cached.map((entry) => ({
      videoId: entry.videoId,
      channelId: entry.channelId,
      title: entry.title,
      thumbnailUrl: entry.thumbnailUrl,
      skillTag: entry.skillTag,
    }));
  }

  if (!featureFlags.youtubeApiKey) return [];

  const enabledChannelIds = await getEnabledChannelIds();
  if (enabledChannelIds.length === 0) return [];

  const query = buildSafeVideoQuery(skill, interest);
  const results: YouTubeVideoResult[] = [];

  try {
    for (const channelId of enabledChannelIds.slice(0, 3)) {
      const url = new URL("https://www.googleapis.com/youtube/v3/search");
      url.searchParams.set("part", "snippet");
      url.searchParams.set("channelId", channelId);
      url.searchParams.set("q", query);
      url.searchParams.set("type", "video");
      url.searchParams.set("safeSearch", "strict");
      url.searchParams.set("maxResults", "3");
      url.searchParams.set("key", featureFlags.youtubeApiKey);

      const response = await fetch(url.toString());
      if (!response.ok) continue;

      const data = (await response.json()) as YouTubeSearchResponse;

      for (const item of data.items ?? []) {
        const thumbnailUrl = item.snippet.thumbnails.medium?.url ?? item.snippet.thumbnails.default?.url ?? "";
        const video: YouTubeVideoResult = {
          videoId: item.id.videoId,
          channelId: item.snippet.channelId,
          title: item.snippet.title,
          thumbnailUrl,
          skillTag: skill,
        };
        results.push(video);
        await cacheVideo({ ...video, skillTag: skill, cachedAt: Date.now() });
      }
    }
  } catch {
    return results;
  }

  return results;
}
