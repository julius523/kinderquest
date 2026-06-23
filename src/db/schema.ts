export const DB_NAME = "kinderquest";
export const DB_VERSION = 1;

export const DB_STORES = {
  childProfiles: "++id, name, createdAt, updatedAt",
  appSettings: "++id, key, updatedAt",
  sessions: "++id, childProfileId, startedAt, endedAt, engagementScore",
  activityResults: "++id, sessionId, childProfileId, skill, activityId, startedAt, completed",
  skillProgress: "++id, childProfileId, skill, level, updatedAt",
  interests: "++id, childProfileId, tag, score, updatedAt",
  rewards: "++id, childProfileId, sessionId, rewardId, unlockedAt, category",
  promptEvents: "++id, sessionId, activityResultId, promptLevel, timestamp",
  behaviorEvents: "++id, sessionId, eventType, intensity, timestamp",
  communicationEvents: "++id, sessionId, childProfileId, phraseId, responseMode, success, timestamp",
  parentNotes: "++id, sessionId, createdAt",
  insights: "++id, childProfileId, sessionId, type, createdAt",
  youtubeCache: "++id, videoId, channelId, skillTag, cachedAt",
  youtubeSettings: "++id, &channelId, enabled, updatedAt",
  printables: "++id, type, createdAt",
} as const;
