import { Event as EventSource } from "../model/googleCalendar/Event"
import { ScheduledEvent } from "../model/ScheduledEvent"

export const transformEvent = (event: EventSource): ScheduledEvent => {

  return {
    id: event.id,
    startTime: (new Date(event.start.dateTime)).valueOf(),
    title: event.summary,
    userEmail: "erangakm@gmail.com"
  }
}
