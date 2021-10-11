import { EventWithMeeting } from "../model/googleCalendar/EventWithMeeting"
import { ScheduledEvent } from "../model/ScheduledEvent"
import { getVideoUrl } from "./eventHelpers"

export const transformEvent = async (event: EventWithMeeting, userEmail: string): Promise<ScheduledEvent> => {
  const link = await getVideoUrl(event);

  return {
    id: event.id,
    startTime: (new Date(event.start.dateTime)).valueOf(),
    title: event.summary,
    link,
  }
}
