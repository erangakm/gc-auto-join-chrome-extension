import { DateTime } from "./DateTime";

export interface Event {
  start: DateTime;
  end: DateTime;
  status: string;
  summary: string;
  hangoutLink?: string;
}
