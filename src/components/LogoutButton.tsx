import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export const LogoutButton: React.FC<{}> = () => {
  const session = useContext(AuthContext);
  if (session.token == null) {
    throw new Error("User not logged in");
  }

  const onClick = () => {
    console.log("clicked logout button>>>>");

    chrome.runtime.sendMessage({
      message: {
        operation: "logout",
        token: session.token
      }
    }, (response) => {
      session.setToken(null);
    })
  }

  return (
    <button onClick={onClick}>Logout</button>
  )
};
