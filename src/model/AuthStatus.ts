export type AuthStatus = {
  loggedIn: false
} | {
  loggedIn: true;
  token: string;
}
