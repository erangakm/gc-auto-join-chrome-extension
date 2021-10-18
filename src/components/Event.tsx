import React, { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  addEventToSchedule,
  removeEventFromSchedule
} from "../lib/eventScheduleHandlers";
import { MeetingType } from "../model/googleCalendar/MeetingType";
import {
  getMeetingType,
  getVideoUrl
} from "../lib/eventHelpers";
import { EventWithMeeting } from "../model/googleCalendar/EventWithMeeting";

interface Props {
  event: EventWithMeeting;
  eventScheduled: boolean;
}

const getMeetingIcon = (event: EventWithMeeting) => {
  switch(event.conferenceData.conferenceSolution.name) {
    case MeetingType.GoogleMeet:
      return "./meet.png";

    case MeetingType.Zoom:
      return "./zoom.png"

    default:
      throw new Error("Unsupported video type");
  }
}

export const Event: React.FC<Props> = ({ event, eventScheduled }) => {
  const [meetingUrl, setMeetingUrl] = useState("");

  const onClick = async (e: any) => {
    const eventSelected = e.target.checked;
    if (eventSelected) {
      await addEventToSchedule(event);
    } else {
      await removeEventFromSchedule(event.id);
    }
  }

  const getMeetingUrl = useCallback(async () => {
    const url = await getVideoUrl(event);
    setMeetingUrl(url)
  }, [event]);

  useEffect(() => {
    getMeetingUrl();
  }, [getMeetingUrl]);

  const middleAlignStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
  }

  return (
    <div className="container-fluid appear-with-fade-in event">
      <div className="event-row row py-2">
        <div className="col-2" style={middleAlignStyle}>
          <img
            src={getMeetingIcon(event)}
            alt={getMeetingType(event)}
            title={getMeetingType(event)}
            style={{ width: "25px" }}
          />
        </div>
        <div className="col-8 px-0">
          <div className="row">
            <div className="col event-name" style={{ fontWeight: 800 }}>
              <a style={{
                color: "#212529"
              }} target="_blank" rel="noreferrer" href={meetingUrl}>{event.summary}</a>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <span style={{fontSize: "12px"}}>{dayjs(event.start.dateTime).format("h:mma")} - {dayjs(event.end.dateTime).format("h:mma")}</span>
            </div>
          </div>
        </div>
        <div className="col-2" style={middleAlignStyle}>
          <div title="Click on me to control your automatic meeting schedule"  className="custom-control custom-switch">
            <input type="checkbox" className="custom-control-input" id={event.id} onClick={onClick} defaultChecked={eventScheduled}></input>
            <label className="custom-control-label" htmlFor={event.id}></label>
          </div>
        </div>
      </div>
    </div>
  )
};
