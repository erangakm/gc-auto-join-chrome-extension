import React from "react";
import { AuthTokens } from "../model/AuthTokens";

interface Props {
  setToken: (token: AuthTokens) => void;
  setTokenLoading: (loading: boolean) => void;
}

export const LoginButton: React.FC<Props> = ({ setToken, setTokenLoading }) => {
  const onClick = () => {
    chrome.runtime.sendMessage({
      message: {
        operation: "login"
      },
    }, (response) => {
      setToken(response);
      setTokenLoading(false);
    });
  }

  return (
    <button onClick={onClick}>Login to Google Calendar</button>
  )
};
