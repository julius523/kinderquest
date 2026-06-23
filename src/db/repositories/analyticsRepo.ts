import { db } from "../db";
import type { BehaviorEvent, ParentInsight, PromptEvent } from "../../types/analytics";
import type { CommunicationEvent } from "../../types/speech";
import type { ParentNoteRecord } from "../../types/db";

export async function logBehaviorEvent(event: BehaviorEvent): Promise<void> {
  await db.behaviorEvents.add(event);
}

export async function getBehaviorEventsForSession(sessionId: number): Promise<BehaviorEvent[]> {
  return db.behaviorEvents.where("sessionId").equals(sessionId).sortBy("timestamp");
}

export async function logPromptEvent(event: PromptEvent): Promise<void> {
  await db.promptEvents.add(event);
}

export async function getPromptEventsForSession(sessionId: number): Promise<PromptEvent[]> {
  return db.promptEvents.where("sessionId").equals(sessionId).sortBy("timestamp");
}

export async function logCommunicationEvent(event: CommunicationEvent): Promise<void> {
  await db.communicationEvents.add(event);
}

export async function getCommunicationEventsForChild(
  childProfileId: number,
): Promise<CommunicationEvent[]> {
  return db.communicationEvents.where("childProfileId").equals(childProfileId).sortBy("timestamp");
}

export async function saveInsight(insight: ParentInsight): Promise<ParentInsight> {
  const id = await db.insights.add(insight);
  return { ...insight, id };
}

export async function getInsightsForChild(childProfileId: number): Promise<ParentInsight[]> {
  return db.insights.where("childProfileId").equals(childProfileId).reverse().sortBy("createdAt");
}

export async function addParentNote(sessionId: number, note: string): Promise<ParentNoteRecord> {
  const record: ParentNoteRecord = { sessionId, note, createdAt: Date.now() };
  const id = await db.parentNotes.add(record);
  return { ...record, id };
}

export async function getParentNotesForSession(sessionId: number): Promise<ParentNoteRecord[]> {
  return db.parentNotes.where("sessionId").equals(sessionId).sortBy("createdAt");
}
