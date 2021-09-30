import React from "react";
import { Event as EventSource } from "../model/googleCalendar/Event";
import dayjs from "dayjs";
import {
  addEventToSchedule,
  removeEventFromSchedule
} from "../lib/chromeStorageHandlers";

interface Props {
  event: EventSource;
  eventScheduled: boolean;
}

export const Event: React.FC<Props> = ({ event, eventScheduled }) => {
  const onClick = async (e: any) => {
    const eventSelected = e.target.checked;
    if (eventSelected) {
      await addEventToSchedule(event)
    } else {
      await removeEventFromSchedule(event.id)
    }
  }

  console.log(event, "EVENT>>>>");

  return (
    <div>
     <input type="checkbox" id={event.id} onClick={onClick} defaultChecked={eventScheduled}></input>
     <label htmlFor={event.id}>
      {event.summary}: {dayjs(event.start.dateTime).format("h:ma")} - {dayjs(event.end.dateTime).format("h:ma")}
     </label>
    </div>
  )
};
