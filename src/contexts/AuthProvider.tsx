import React, { useState } from "react";
import { LoginButton } from "../LoginButton";
import { AuthStatus } from "../model/AuthStatus";
import { AuthContext } from "./AuthContext";

export const AuthProvider: React.FC<{}> = ({ children }) => {
  const [authStatus, setAuthStatus] = useState<AuthStatus>({ loggedIn: false })

  return (
    <AuthContext.Provider value={authStatus}>
      { authStatus.loggedIn ? children : <LoginButton setAuthStatus={setAuthStatus} /> }
    </AuthContext.Provider>
  )
}
