import { MeetingType } from "./MeetingType";

export interface ConferenceData {
  conferenceSolution: {
    name: MeetingType | any;
  },
  entryPoints: [{
    entryPointType: string;
    uri: string;
  }]
}
