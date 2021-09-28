import { Event } from "../model/googleCalendar/Event";
import { ScheduledEvent } from "../model/ScheduledEvent";
import { transformEvent } from "./transformEvent";

export const getStorageKey = async <T = any>(key: string): Promise<T | null> =>
  new Promise((resolve) => {
    let value: T | null = null;

    chrome.storage.local.get(key, (keyObject) => {
      value = keyObject?.[key] != null ? keyObject[key] as T : null;
      resolve(value)
    });
  });

export const setStorageKey = async (key: string, value: any): Promise<void> => {
  const existingKey = await getStorageKey(key);
  if (existingKey != null) {
    await chrome.storage.local.remove(key);
  }

  await chrome.storage.local.set({ [key]: value })
}

export const addEventToSchedule = async (event: Event): Promise<void> => {
  const schedule = (await getStorageKey<ScheduledEvent[]>("eventSchedule")) ?? [];
  schedule.push(
    transformEvent(event)
  );
  await setStorageKey("eventSchedule", schedule);
}

export const removeEventFromSchedule = async (eventId: string): Promise<void> => {
  const schedule = (await getStorageKey<ScheduledEvent[]>("eventSchedule")) ?? [];
  const newSchedule = schedule.filter((s) => s.id !== eventId);
  await setStorageKey("eventSchedule", newSchedule)
}
