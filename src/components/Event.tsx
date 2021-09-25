import React from "react";
import { Event as EventSource } from "../model/googleCalendar/Event";
import dayjs from "dayjs";

interface Props {
  event: EventSource;
}

export const Event: React.FC<Props> = ({ event }) => {
  console.log(event);
  return (
    <>
      <p>{event.summary}: {dayjs(event.start.dateTime).format("h:ma")} - {dayjs(event.end.dateTime).format("h:ma")}</p>
    </>
  )
};
