import { AuthSession } from "../model/AuthSession";
import { Event } from "../model/googleCalendar/Event"
import { MeetingType } from "../model/googleCalendar/MeetingType"
import { getStorageKey } from "./chromeStorageHandlers";

export const isGoogleMeeting = (event: Event) =>
  event.conferenceData?.conferenceSolution.name === MeetingType.GoogleMeet;


export const isZoomMeeting = (event: Event) =>
  event.conferenceData?.conferenceSolution.name === MeetingType.Zoom;

export const getMeetingType = (event: Event): MeetingType | "unknown" =>
  event.conferenceData?.conferenceSolution.name ?? "unknown";

export const isSupportedVideoMeetingPlatform = (event: Event) =>
  [MeetingType.GoogleMeet, MeetingType.Zoom].includes(
    event.conferenceData?.conferenceSolution.name)

export const getVideoUrl = async (event: Event) => {
  const currentSession = await getStorageKey<AuthSession>("authSession");
  if (currentSession == null) {
    throw new Error("user not logged in");
  }

  const meetingType = getMeetingType(event);
  const entryPoint = event.conferenceData?.entryPoints.find((ep) => ep.entryPointType === "video");
  const meetingUrl = entryPoint?.uri ?? "unkown";


  return meetingType === MeetingType.GoogleMeet ? `${meetingUrl}?authuser=${currentSession.userEmail}` : meetingUrl;
}
