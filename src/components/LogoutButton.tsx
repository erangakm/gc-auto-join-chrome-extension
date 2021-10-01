import { Button } from "@material-ui/core";
import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export const LogoutButton: React.FC<{}> = () => {
  const authCtx = useContext(AuthContext);
  if (authCtx.session == null) {
    throw new Error("User not logged in");
  }

  const onClick = () => {
    chrome.runtime.sendMessage({
      message: {
        operation: "logout",
      }
    }, () => {
      authCtx.setSession(null);
    })
  }

  return (
    <Button variant="contained" color="primary" onClick={onClick}>Sign out</Button>
  )
};
