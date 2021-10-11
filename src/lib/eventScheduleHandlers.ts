import { AuthSession } from "../model/AuthSession";
import { ScheduledEvent } from "../model/ScheduledEvent";
import { getStorageKey, setStorageKey } from "./chromeStorageHandlers";
import { transformEvent } from "./transformEvent";
import dayjs from "dayjs";
import { AlarmTypes } from "../model/AlarmTypes";
import { EventWithMeeting } from "../model/googleCalendar/EventWithMeeting";

export const addEventToSchedule = async (event: EventWithMeeting): Promise<void> => {
  const eventTime = new Date(event.start.dateTime).valueOf();

  // Reminder for 1 minute before.
  chrome.alarms.create(`eventSchudule--${event.id}--${AlarmTypes.OneMinuteReminder}`, {
    when: dayjs(eventTime).subtract(1, "minute").valueOf()
  });

  // Reminder for 3 seconds before
  chrome.alarms.create(`eventSchudule--${event.id}--${AlarmTypes.ThreeSecondReminder}`, {
    when: dayjs(eventTime).subtract(3, "seconds").valueOf()
  });

  // Actual meeting join alarm.
  chrome.alarms.create(`eventSchudule--${event.id}--${AlarmTypes.MeetingRedirect}`, {
    when: eventTime,
  });

  await persistScheduledEventInStorage(event);
}

export const removeEventFromSchedule = async (eventId: string): Promise<void> => {
  await chrome.alarms.clear(`eventSchudule--${eventId}--${AlarmTypes.OneMinuteReminder}`);
  await chrome.alarms.clear(`eventSchudule--${eventId}--${AlarmTypes.ThreeSecondReminder}`);
  await chrome.alarms.clear(`eventSchudule--${eventId}--${AlarmTypes.MeetingRedirect}`);
  await removeScheduledEventFromStorage(eventId);
}


export const persistScheduledEventInStorage = async (event: EventWithMeeting): Promise<void> => {
  const currentSession = await getStorageKey<AuthSession>("authSession");
  if (currentSession == null) {
    throw new Error("user not logged in");
  }

  const schedule = (await getStorageKey<ScheduledEvent[]>("eventSchedule")) ?? [];
  schedule.push(
    await transformEvent(event, currentSession.userEmail)
  );
  await setStorageKey("eventSchedule", schedule);
}

export const removeScheduledEventFromStorage = async (eventId: string): Promise<void> => {
  const schedule = (await getStorageKey<ScheduledEvent[]>("eventSchedule")) ?? [];
  const newSchedule = schedule.filter((s) => s.id !== eventId);
  await setStorageKey("eventSchedule", newSchedule)
}
