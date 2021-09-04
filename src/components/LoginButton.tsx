import React from "react";

interface Props {
  setToken: (token: string) => void;
  setTokenLoading: (loading: boolean) => void;
}

export const LoginButton: React.FC<Props> = ({ setToken, setTokenLoading }) => {
  const onClick = () => {
    console.log("clicked login button>>>>");
    chrome.runtime.sendMessage({ message: {
      operation: "get_auth_token",
    } }, (response) => {
      setToken(response);
      console.log(response, "RESPONSE>>>>>>>>>>.");
      setTokenLoading(false);
    });
  }

  return (
    <button onClick={onClick}>Login to Google Calendar</button>
  )
};
