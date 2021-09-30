import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { EventList } from "./EventList";
import { LogoutButton } from "./LogoutButton";

export const LoggedInPage: React.FC<{}> = () => {
  const authCtx = useContext(AuthContext);
  if (authCtx.session == null) {
    throw new Error("User not logged in");
  }

  return (
    <>
      <EventList />
      <LogoutButton />
    </>
  )
};
