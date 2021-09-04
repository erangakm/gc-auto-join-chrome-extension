export interface AuthStatus {
  token?: string | null;
  setToken: (token: string | null) => void;
}
