import React, { useContext } from "react";
import Button from "react-bootstrap/Button";
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
    <Button
      variant="outline-secondary"
      className="mt-3 mb-2 logout-button"
      onClick={onClick}
    >
      Sign out of {authCtx.session.userEmail}
    </Button>
  )
};
