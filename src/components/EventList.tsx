import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";

export const EventList: React.FC<{}> = () => {
  const session = useContext(AuthContext);
  if (session.tokens == null) {
    throw new Error("User not logged in");
  }

  const [events, setEvents] = useState<string | null>(null);

  useEffect(() => {
    chrome.runtime.sendMessage({ message: {
      operation: "call_calendar",
      token: session.tokens?.accessToken,
    } }, (response) => {
      setEvents(response);
    })
  }, [session.tokens])

  console.log(events, "EBENTS>>>>>>>");

  return (
    <>
      <p>Event 1</p>
      <p>Event 2</p>
    </>
  )
};
