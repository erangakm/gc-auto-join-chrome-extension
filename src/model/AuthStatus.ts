import { AuthSession } from "./AuthSession";

export interface AuthStatus {
  session: AuthSession | null;
  setSession: (session: AuthSession | null) => void;
}
