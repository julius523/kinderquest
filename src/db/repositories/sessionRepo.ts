import { db } from "../db";
import { createEmptySession, type Session } from "../../types/activity";
import type { DeviceType } from "../../types/game";

export async function startSession(
  childProfileId: number,
  deviceType: DeviceType,
): Promise<Session> {
  const session = createEmptySession(childProfileId, deviceType);
  const id = await db.sessions.add(session);
  return { ...session, id };
}

export async function endSession(
  sessionId: number,
  finalFields: Partial<Session> = {},
): Promise<void> {
  await db.sessions.update(sessionId, { ...finalFields, endedAt: Date.now() });
}

export async function updateSession(sessionId: number, changes: Partial<Session>): Promise<void> {
  await db.sessions.update(sessionId, changes);
}

export async function getSession(sessionId: number): Promise<Session | undefined> {
  return db.sessions.get(sessionId);
}

export async function getSessionsForChild(childProfileId: number): Promise<Session[]> {
  return db.sessions.where("childProfileId").equals(childProfileId).reverse().sortBy("startedAt");
}

export async function getRecentSessions(childProfileId: number, limit: number): Promise<Session[]> {
  const sessions = await getSessionsForChild(childProfileId);
  return sessions.slice(0, limit);
}
