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

  return (
    <div className="custom-control custom-switch my-2">
     <input type="checkbox" className="custom-control-input" id={event.id} onClick={onClick} defaultChecked={eventScheduled}></input>
     <label className="custom-control-label" htmlFor={event.id}>
      {event.summary}: {dayjs(event.start.dateTime).format("h:mma")} - {dayjs(event.end.dateTime).format("h:mma")}
     </label>
    </div>
  )
};
