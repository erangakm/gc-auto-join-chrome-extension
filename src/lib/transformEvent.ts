import { EventWithMeeting } from "../model/googleCalendar/EventWithMeeting"
import { MeetingType } from "../model/googleCalendar/MeetingType";
import { ScheduledEvent } from "../model/ScheduledEvent"
import { getMeetingType, getVideoUrl } from "./eventHelpers"

export const transformEvent = (event: EventWithMeeting, userEmail: string): ScheduledEvent => {
  const meetingType = getMeetingType(event);
  const meetingUrl = getVideoUrl(event);

  return {
    id: event.id,
    startTime: (new Date(event.start.dateTime)).valueOf(),
    title: event.summary,
    link: meetingType === MeetingType.GoogleMeet ?
      `${meetingUrl}?authuser=${userEmail}`
        : meetingUrl,
  }
}
