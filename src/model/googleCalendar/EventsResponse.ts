import { Event } from "./Event";

export interface EventsResponse {
  items: Event[];
  summary: string;
  timeZone: string;
}
