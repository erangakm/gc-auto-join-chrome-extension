import React from "react";
import { AuthSession } from "../model/AuthSession";
import GoogleButton from 'react-google-button'

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
    <GoogleButton style={{
      fontWeight: 800,
      width: "280px",
      fontSize: "15px"
    }} label="Sign in with Google Calendar" onClick={onClick}></GoogleButton>
  )
};
