import React from "react";

interface Props {
  setToken: (token: string) => void;
}

export const LoginButton: React.FC<Props> = ({ setToken }) => {
  const onClick = () => {
    console.log("clicked login button>>>>");
    chrome.runtime.sendMessage({ message: {
      operation: "get_auth_token",
    } }, (response) => {
      setToken(response);
      console.log(response, "RESPONSE>>>>>>>>>>.");
    });
  }

  return (
    <button onClick={onClick}>Login to Google Calendar</button>
  )
};
