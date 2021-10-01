import { Box } from "@material-ui/core";
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
    <Box m={2}>
      <EventList eventsLoading={eventsLoading} setEventsLoading={setEventsLoading} />
      { !eventsLoading ? <Box mt={2}><LogoutButton /></Box> : null }
    </Box>
  )
};
