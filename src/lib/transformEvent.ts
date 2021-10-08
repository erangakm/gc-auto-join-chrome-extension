import { Event as EventSource } from "../model/googleCalendar/Event"
import { ScheduledEvent } from "../model/ScheduledEvent"

export const transformEvent = (event: EventSource, userEmail: string): ScheduledEvent => {

  return {
    id: event.id,
    startTime: (new Date(event.start.dateTime)).valueOf(),
    title: event.summary,
    link: `${event.hangoutLink}?authuser=${userEmail}`,
  }
}
