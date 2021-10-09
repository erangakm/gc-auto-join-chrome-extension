import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import dayjs from "dayjs";
import { Event as EventComponent } from "./Event";
import { ScheduledEvent } from "../model/ScheduledEvent";
import { getStorageKey } from "../lib/chromeStorageHandlers";
import { isSupportedVideoMeetingPlatform } from "../lib/eventHelpers";
import { EventWithMeeting } from "../model/googleCalendar/EventWithMeeting";
import { NoEventsScreen } from "./NoEventsScreen";

export const EventList: React.FC<{}> = () => {
  const authCtx = useContext(AuthContext);
  if (authCtx.session == null) {
    throw new Error("User not logged in");
  }

  const [eventsLoading, setEventsLoading] = useState(true);
  const [events, setEvents] = useState<EventWithMeeting[]>([]);
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
      console.log(data.items, "MEETINGS>>>>>>>>>");
      const filteredEvents = data.items.filter(isSupportedVideoMeetingPlatform)
      setEvents(filteredEvents as EventWithMeeting[]);
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

  console.log("calling event list")

  return (
    <div className="">
      {eventsLoading ? <p className="mt-2 pl-2 appear-with-fade-in">Events loading...</p> :
        <>
          {
            events
              .sort((a, b) => new Date(a.start.dateTime).valueOf() < new Date(b.start.dateTime).valueOf() ? -1 : 0)
              .map((event, i) => (
                <EventComponent key={i} event={event} eventScheduled={eventSchedule.find((e) => e.id === event.id) != null} />
            ))
          }
          { events.length === 0 ? <NoEventsScreen /> : null  }
        </>
      }
    </div>
  )
};
