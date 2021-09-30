import { createContext } from "react";
import { AuthStatus } from "../model/AuthStatus";

export const AuthContext = createContext<AuthStatus>({
  session: null,
  setSession: () => undefined
});
