import React from "react";
import { Event as EventSource } from "../model/googleCalendar/Event";
import dayjs from "dayjs";
import {
  addEventToSchedule,
  removeEventFromSchedule
} from "../lib/eventScheduleHandlers";

interface Props {
  event: EventSource;
  eventScheduled: boolean;
}

export const Event: React.FC<Props> = ({ event, eventScheduled }) => {
  const onClick = async (e: any) => {
    const eventSelected = e.target.checked;
    if (eventSelected) {
      await addEventToSchedule(event);
    } else {
      await removeEventFromSchedule(event.id);
    }
  }

  const middleAlignStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
  }

  return (
    <div className="container-fluid appear-with-fade-in event">
      <div className="event-row row py-2">
        <div className="col-2" style={middleAlignStyle}>
          <img className="" src="./meet.png" alt="Hangout meeting" style={{ width: "25px" }} />
        </div>
        <div className="col-8 pl-0">
          <div className="row">
            <div className="col event-name" style={{ fontWeight: 800 }}>
              <a style={{
                color: "#212529"
              }} target="_blank" rel="noreferrer" href={event.hangoutLink}>{event.summary}</a>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <span style={{fontSize: "12px"}}>{dayjs(event.start.dateTime).format("h:mma")} - {dayjs(event.end.dateTime).format("h:mma")}</span>
            </div>
          </div>
        </div>
        <div className="col-2" style={middleAlignStyle}>
          <div className="custom-control custom-switch">
            <input type="checkbox" className="custom-control-input" id={event.id} onClick={onClick} defaultChecked={eventScheduled}></input>
            <label className="custom-control-label" htmlFor={event.id}></label>
          </div>
        </div>
      </div>
    </div>
  )
};
