import React, { useState } from "react";
import { LoginButton } from "../components/LoginButton";
import { AuthContext } from "./AuthContext";

export const AuthProvider: React.FC<{}> = ({ children }) => {
  const [token, setToken] = useState<string | undefined | null>(undefined)

  return (
    <AuthContext.Provider value={{
      token,
      setToken
    }}>
      { token != null ? children : <LoginButton setToken={setToken} /> }
    </AuthContext.Provider>
  )
}
