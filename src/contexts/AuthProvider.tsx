import React, { useCallback, useEffect, useState } from "react";
import { LoginButton } from "../components/LoginButton";
import { AuthContext } from "./AuthContext";
import { getStorageKey } from "../lib/getStorageKey";
import { AuthTokens } from "../model/AuthTokens";

export const AuthProvider: React.FC<{}> = ({ children }) => {
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [tokensLoading, setTokensLoading] = useState(true);

  const fetchTokens = useCallback(async () => {
    const tokensFromStorage = await getStorageKey<AuthTokens>("authTokens");
    console.log(tokensFromStorage, "tokens from storage...");
    if (tokensFromStorage == null) {
      setTokens(null);
      setTokensLoading(false);

      return;
    }

    console.log("validating token...");
    chrome.runtime.sendMessage({
      message: {
        operation: "validate_token",
        token: tokensFromStorage?.accessToken
      }
    }, (tokenValid) => {
      if (!tokenValid) {
        console.log("about to refresh token...")
        chrome.runtime.sendMessage({
          message: {
            operation: "refresh_token",
            refreshToken: tokensFromStorage.refreshToken,
          },
        }, (accessToken) => {
          console.log("saving newly refreshed token...", accessToken);
          setTokens({
            accessToken,
            refreshToken: tokensFromStorage?.refreshToken,
          });
          setTokensLoading(false);
        })
      }
      else {
        console.log("token from storage is still valid...");
        setTokens(tokensFromStorage)
        setTokensLoading(false);
      }
    });

  }, [setTokens, setTokensLoading])

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  if (tokensLoading) {
    return (
      <p>Loading your session...</p>
    )
  }

  return (
    <AuthContext.Provider value={{
      tokens,
      setTokens
    }}>
      { tokens != null ? children : <LoginButton setToken={setTokens} setTokenLoading={setTokensLoading} /> }
    </AuthContext.Provider>
  )
}
