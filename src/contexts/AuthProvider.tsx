import React, { useEffect, useState } from "react";
import { LoginButton } from "../components/LoginButton";
import { AuthContext } from "./AuthContext";

export const AuthProvider: React.FC<{}> = ({ children }) => {
  const [token, setToken] = useState<string | undefined | null>(undefined);
  const [tokenLoading, setTokenLoading] = useState(true);

  useEffect(() => {
    chrome.runtime.sendMessage({ message: {
      operation: "refetch_token",
    } }, (response) => {
      console.log(response, "RESPONSE>>>>>>>>>>.");
      setToken(response);
      setTokenLoading(false);
    });
  }, []);

  if (tokenLoading) {
    return (
      <p>Grabbing your session...</p>
    )
  }

  return (
    <AuthContext.Provider value={{
      token,
      setToken
    }}>
      { token != null ? children : <LoginButton setToken={setToken} setTokenLoading={setTokenLoading} /> }
    </AuthContext.Provider>
  )
}
