import { AuthTokens } from "./AuthTokens";

export interface AuthStatus {
  tokens: AuthTokens | null;
  setTokens: (tokens: AuthTokens | null) => void;
}
