import Dexie, { type Table } from "dexie";
import { DB_NAME, DB_STORES, DB_VERSION } from "./schema";
import type { ChildProfile } from "../types/child";
import type { AppSettings } from "../types/settings";
import type { Session, ActivityResult } from "../types/activity";
import type {
  InterestRecord,
  ParentNoteRecord,
  PrintableRecord,
  RewardRecord,
  SkillProgressRecord,
} from "../types/db";
import type { BehaviorEvent, ParentInsight, PromptEvent } from "../types/analytics";
import type { CommunicationEvent } from "../types/speech";
import type { YouTubeCacheEntry, YouTubeChannelSetting } from "../types/youtube";

export class KinderQuestDB extends Dexie {
  childProfiles!: Table<ChildProfile, number>;
  appSettings!: Table<AppSettings, number>;
  sessions!: Table<Session, number>;
  activityResults!: Table<ActivityResult, number>;
  skillProgress!: Table<SkillProgressRecord, number>;
  interests!: Table<InterestRecord, number>;
  rewards!: Table<RewardRecord, number>;
  promptEvents!: Table<PromptEvent, number>;
  behaviorEvents!: Table<BehaviorEvent, number>;
  communicationEvents!: Table<CommunicationEvent, number>;
  parentNotes!: Table<ParentNoteRecord, number>;
  insights!: Table<ParentInsight, number>;
  youtubeCache!: Table<YouTubeCacheEntry, number>;
  youtubeSettings!: Table<YouTubeChannelSetting, number>;
  printables!: Table<PrintableRecord, number>;

  constructor() {
    super(DB_NAME);
    this.version(DB_VERSION).stores(DB_STORES);
  }
}

export const db = new KinderQuestDB();
