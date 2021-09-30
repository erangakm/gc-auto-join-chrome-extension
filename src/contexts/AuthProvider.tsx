import React, { useCallback, useEffect, useState } from "react";
import { LoginButton } from "../components/LoginButton";
import { AuthContext } from "./AuthContext";
import { getStorageKey } from "../lib/chromeStorageHandlers";
import { AuthSession } from "../model/AuthSession";

export const AuthProvider: React.FC<{}> = ({ children }) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  const fetchSession = useCallback(async () => {
    const sessionFromStorage = await getStorageKey<AuthSession>("authSession");
    console.log(sessionFromStorage, "session from storage...");
    if (sessionFromStorage == null) {
      setSession(null);
      setSessionLoading(false);

      return;
    }

    console.log("validating session...");
    chrome.runtime.sendMessage({
      message: {
        operation: "validate_token",
        token: sessionFromStorage?.accessToken
      }
    }, (tokenValid) => {
      if (!tokenValid) {
        console.log("about to refresh session...")
        chrome.runtime.sendMessage({
          message: {
            operation: "refresh_token",
            refreshToken: sessionFromStorage.refreshToken,
          },
        }, (accessToken) => {
          console.log("saving newly refreshed tokens...", accessToken);
          setSession({
            accessToken,
            refreshToken: sessionFromStorage?.refreshToken,
            userEmail: sessionFromStorage?.userEmail,
          });
          setSessionLoading(false);
        })
      }
      else {
        console.log("session from storage is still valid...");
        setSession(sessionFromStorage)
        setSessionLoading(false);
      }
    });

  }, [setSession, setSessionLoading])

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  if (sessionLoading) {
    return (
      <p>Loading your session...</p>
    )
  }

  return (
    <AuthContext.Provider value={{
      session,
      setSession
    }}>
      { session != null ? children : <LoginButton setTokens={setSession} setTokenLoading={setSessionLoading} /> }
    </AuthContext.Provider>
  )
}
