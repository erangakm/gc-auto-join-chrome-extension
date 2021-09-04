import React from "react";
import { AuthStatus } from "./model/AuthStatus";

interface Props {
  setAuthStatus: (status: AuthStatus) => void;
}

export const LoginButton: React.FC<Props> = ({ setAuthStatus }) => {
  const onClick = () => {
    console.log("clicked login button>>>>");
    chrome.runtime.sendMessage({ message: {
      operation: "get_auth_token",
    } }, (response) => {
      setAuthStatus({
        loggedIn: true,
        token: response
      });
      console.log(response, "RESPONSE>>>>>>>>>>.");
    });
  }

  return (
    <button onClick={onClick}>Login to Google Calendar</button>
  )
};

// 'get_auth_token', setToken
