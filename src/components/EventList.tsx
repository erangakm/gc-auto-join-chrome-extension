import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import dayjs from "dayjs";
import { Event } from "../model/googleCalendar/Event";
import { Event as EventComponent } from "./Event";
import { ScheduledEvent } from "../model/ScheduledEvent";
import { getStorageKey } from "../lib/chromeStorageHandlers";

interface Props {
  eventsLoading: boolean;
  setEventsLoading: (loading: boolean) => void;
}

export const EventList: React.FC<Props> = ({ eventsLoading, setEventsLoading }) => {
  const authCtx = useContext(AuthContext);
  if (authCtx.session == null) {
    throw new Error("User not logged in");
  }

  const [events, setEvents] = useState<Event[]>([]);
  const [eventSchedule, setEventSchedule] = useState<ScheduledEvent[]>([]);

  useEffect(() => {
    const now = dayjs();
    const timeMin = encodeURIComponent(now.format())
    const timeMax = encodeURIComponent(now.endOf("day").format());
    const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&singleEvents=true&timeMax=${timeMax}`;
    const options = {
      headers: {
        "Authorization": `Bearer ${authCtx.session?.accessToken}`
      }
    };

    const fetchData = async () => {
      const response = await fetch(url, options)
      const data = await response.json();
      const filteredEvents = data.items.filter((event: any) => event.hangoutLink != null)
      setEvents(filteredEvents as Event[]);
      setEventsLoading(false);
    }

    fetchData();
  }, [authCtx.session, setEventsLoading]);

  useEffect(() => {
    const fetchEvents = async () => {
      const events = await getStorageKey<ScheduledEvent[]>("eventSchedule");
      setEventSchedule(events ?? [])
    }

    fetchEvents();
  }, [setEventSchedule]);

  return (
    <>
      {eventsLoading ? <p>Events loading...</p> :
        <>
          {
            events
              .map((event, i) => (
                <EventComponent key={i} event={event} eventScheduled={eventSchedule.find((e) => e.id === event.id) != null} />
            ))
          }
          { events.length === 0 ? <p>No events today</p> : null  }
        </>
      }
    </>
  )
};
