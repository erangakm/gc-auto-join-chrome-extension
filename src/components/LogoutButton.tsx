import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export const LogoutButton: React.FC<{}> = () => {
  const session = useContext(AuthContext);
  if (session.tokens == null) {
    throw new Error("User not logged in");
  }

  const onClick = () => {
    chrome.runtime.sendMessage({
      message: {
        operation: "logout",
        token: session.tokens
      }
    }, () => {
      session.setTokens(null);
    })
  }

  return (
    <button onClick={onClick}>Logout</button>
  )
};
