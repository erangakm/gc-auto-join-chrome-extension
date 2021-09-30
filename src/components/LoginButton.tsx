import React from "react";
import { AuthSession } from "../model/AuthSession";

interface Props {
  setTokens: (token: AuthSession) => void;
  setTokenLoading: (loading: boolean) => void;
}

export const LoginButton: React.FC<Props> = ({ setTokens, setTokenLoading }) => {
  const onClick = () => {
    chrome.runtime.sendMessage({
      message: {
        operation: "login"
      },
    }, (response) => {
      setTokens(response);
      setTokenLoading(false);
    });
  }

  return (
    <button onClick={onClick}>Login to Google Calendar</button>
  )
};
