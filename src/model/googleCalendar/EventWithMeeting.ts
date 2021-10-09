import { Event } from "./Event";

export type EventWithMeeting = Omit<Event, "conferenceData"> & {
  conferenceData: NonNullable<Event["conferenceData"]>
};
