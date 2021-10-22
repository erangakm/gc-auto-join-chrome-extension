import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import dayjs from "dayjs";
import { Event as EventComponent } from "./Event";
import { ScheduledEvent } from "../model/ScheduledEvent";
import { getStorageKey } from "../lib/chromeStorageHandlers";
import { isSupportedVideoMeetingPlatform } from "../lib/eventHelpers";
import { EventWithMeeting } from "../model/googleCalendar/EventWithMeeting";
import { NoEventsScreen } from "./NoEventsScreen";
import { EventListSkeleton } from "./EventListSkeleton";
import { calendarEventEndpoint } from "../googleEndpoints";

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
    const url = `${calendarEventEndpoint}?timeMin=${timeMin}&singleEvents=true&timeMax=${timeMax}`;
    const options = {
      headers: {
        "Authorization": `Bearer ${authCtx.session?.accessToken}`
      }
    };

    const fetchData = async () => {
      const response = await fetch(url, options)
      const data = await response.json();
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

  return (
    <div className="">
      {eventsLoading ? <EventListSkeleton/> :
        <>
          { events.length === 0
            ? <NoEventsScreen />
              : <>
                  {
                    <p className="px-3 m-0 pt-3 pb-2" style={{
                      fontSize: "11px",
                      fontStyle: "italic"
                    }}>Use the toggle on the right had side to select meetings you want to be taken to at the scheduled start time:</p>
                  }
                  {
                    events
                      .sort((a, b) => new Date(a.start.dateTime).valueOf() < new Date(b.start.dateTime).valueOf() ? -1 : 0)
                      .map((event, i) => (
                        <EventComponent key={i} event={event} eventScheduled={eventSchedule.find((e) => e.id === event.id) != null} />
                    ))
                  }
                </>
          }
        </>
      }
    </div>
  )
};
