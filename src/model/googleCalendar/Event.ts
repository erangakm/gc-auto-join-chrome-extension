import { ConferenceData } from "./ConferenceData";
import { DateTime } from "./DateTime";

export interface Event {
  id: string;
  start: DateTime;
  end: DateTime;
  status: string;
  summary: string;
  conferenceData?: ConferenceData;
}
