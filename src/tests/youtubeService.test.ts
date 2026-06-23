import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { db } from "../db/db";
import { fetchApprovedVideos, buildSafeVideoQuery, isYouTubeEnabled } from "../services/youtubeService";
import { useSettingsStore } from "../state/settingsStore";
import { setChannelEnabled, cacheVideo } from "../db/repositories/youtubeRepo";
import { APPROVED_YOUTUBE_CHANNELS } from "../data/youtubeWhitelist";

// Tests must not depend on whether a real (gitignored) API key happens to
// be present in .env on this machine — mock it explicitly so the suite is
// portable to a fresh checkout / CI with no .env at all.
vi.mock("../app/featureFlags", () => ({
  featureFlags: { youtubeApiKey: "test-api-key" },
}));

beforeAll(async () => {
  await db.open();
});

beforeEach(() => {
  useSettingsStore.setState((state) => ({
    settings: { ...state.settings, youtubeEnabled: false },
  }));
});

afterEach(async () => {
  await Promise.all(db.tables.map((table) => table.clear()));
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("buildSafeVideoQuery", () => {
  it("maps known skills to a safe preschool-oriented search term", () => {
    expect(buildSafeVideoQuery("letters")).toBe("preschool letter sounds");
    expect(buildSafeVideoQuery("calm_body")).toBe("kids breathing calm body");
  });

  it("falls back to a generic safe term for skills with no explicit mapping", () => {
    expect(buildSafeVideoQuery("safe_behavior")).toBe("preschool learning");
  });

  it("appends the interest when provided", () => {
    expect(buildSafeVideoQuery("letters", "cars")).toBe("preschool letter sounds cars");
  });
});

describe("isYouTubeEnabled", () => {
  it("is disabled by default", () => {
    expect(isYouTubeEnabled()).toBe(false);
  });
});

describe("fetchApprovedVideos", () => {
  it("returns no videos when YouTube is disabled, regardless of API key", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    const videos = await fetchApprovedVideos("letters");

    expect(videos).toEqual([]);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("returns cached videos without hitting the network when a cache exists", async () => {
    useSettingsStore.setState((state) => ({ settings: { ...state.settings, youtubeEnabled: true } }));
    await cacheVideo({
      videoId: "abc123",
      channelId: APPROVED_YOUTUBE_CHANNELS[0].channelId,
      skillTag: "letters",
      title: "Cached Letters Video",
      thumbnailUrl: "https://example.com/thumb.jpg",
      cachedAt: Date.now(),
    });

    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    const videos = await fetchApprovedVideos("letters");

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(videos).toHaveLength(1);
    expect(videos[0].videoId).toBe("abc123");
  });

  it("only ever queries enabled channel ids when calling the YouTube API", async () => {
    useSettingsStore.setState((state) => ({ settings: { ...state.settings, youtubeEnabled: true } }));
    const enabledChannel = APPROVED_YOUTUBE_CHANNELS[0];
    await setChannelEnabled(enabledChannel.channelId, true);

    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        items: [
          {
            id: { videoId: "xyz789" },
            snippet: {
              title: "Letter Sounds Song",
              channelId: enabledChannel.channelId,
              thumbnails: { medium: { url: "https://example.com/xyz.jpg" } },
            },
          },
        ],
      }),
    });
    vi.stubGlobal("fetch", fetchSpy);

    const videos = await fetchApprovedVideos("letters");

    expect(fetchSpy).toHaveBeenCalled();
    const calledUrl = new URL(fetchSpy.mock.calls[0][0]);
    expect(calledUrl.searchParams.get("channelId")).toBe(enabledChannel.channelId);
    expect(videos.some((v) => v.videoId === "xyz789")).toBe(true);
  });

  it("never throws when the network request fails", async () => {
    useSettingsStore.setState((state) => ({ settings: { ...state.settings, youtubeEnabled: true } }));
    await setChannelEnabled(APPROVED_YOUTUBE_CHANNELS[0].channelId, true);
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));

    await expect(fetchApprovedVideos("letters")).resolves.toEqual([]);
  });
});
