import React, { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { EventList } from "./EventList";
import { LogoutButton } from "./LogoutButton";

export const LoggedInPage: React.FC<{}> = () => {
  const [eventsLoading, setEventsLoading] = useState(true);

  const authCtx = useContext(AuthContext);
  if (authCtx.session == null) {
    throw new Error("User not logged in");
  }

  return (
    <>
      <EventList eventsLoading={eventsLoading} setEventsLoading={setEventsLoading} />
      { !eventsLoading ? <LogoutButton /> : null }
    </>
  )
};
