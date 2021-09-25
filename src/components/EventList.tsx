import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import dayjs from "dayjs";
import { Event } from "../model/googleCalendar/Event";
import { Event as EventComponent } from "./Event";

export const EventList: React.FC<{}> = () => {
  const session = useContext(AuthContext);
  if (session.tokens == null) {
    throw new Error("User not logged in");
  }

  const [events, setEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  useEffect(() => {
    const now = dayjs();
    const timeMin = encodeURIComponent(now.format())
    const timeMax = encodeURIComponent(now.endOf("day").format());
    const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&singleEvents=true&timeMax=${timeMax}`;
    const options = {
      headers: {
        "Authorization": `Bearer ${session.tokens?.accessToken}`
      }
    };

    const fetchData = async () => {
      const response = await fetch(url, options)
      const data = await response.json();
      setEvents(data.items as Event[]);
      setEventsLoading(false);
    }

    fetchData();
  }, [session.tokens]);

  return (
    <>
      {eventsLoading ? <p>Events loading...</p> :
        events.map((event, i) => (
          <EventComponent key={i} event={event} />
        ))
      }
    </>
  )
};
