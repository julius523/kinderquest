export type ApprovedYouTubeChannel = {
  name: string;
  handle: string;
  channelId: string;
  tags: string[];
  enabledByDefault: boolean;
};

export type YouTubeChannelSetting = {
  id?: number;
  channelId: string;
  enabled: boolean;
  updatedAt: number;
};

export type YouTubeVideoResult = {
  videoId: string;
  channelId: string;
  title: string;
  thumbnailUrl: string;
  skillTag?: string;
};

export type YouTubeCacheEntry = {
  id?: number;
  videoId: string;
  channelId: string;
  skillTag: string;
  title: string;
  thumbnailUrl: string;
  helpful?: boolean;
  cachedAt: number;
};
