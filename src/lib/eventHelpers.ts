import { Event } from "../model/googleCalendar/Event"
import { MeetingType } from "../model/googleCalendar/MeetingType"

export const isGoogleMeeting = (event: Event) =>
  event.conferenceData?.conferenceSolution.name === MeetingType.GoogleMeet;


export const isZoomMeeting = (event: Event) =>
  event.conferenceData?.conferenceSolution.name === MeetingType.Zoom;

export const getMeetingType = (event: Event): MeetingType | "unknown" =>
  event.conferenceData?.conferenceSolution.name ?? "unknown";

export const isSupportedVideoMeetingPlatform = (event: Event) =>
  [MeetingType.GoogleMeet, MeetingType.Zoom].includes(
    event.conferenceData?.conferenceSolution.name)

export const getVideoUrl = (event: Event) => {
  const entryPoint = event.conferenceData?.entryPoints.find((ep) => ep.entryPointType === "video");

  return entryPoint?.uri ?? "unkown";
}
