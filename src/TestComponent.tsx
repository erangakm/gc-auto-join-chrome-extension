import React, { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";

interface Props {
}

export const TestComponent: React.FC<Props> = () => {
  const authContext = useContext(AuthContext);

  return (
    <p>{authContext.loggedIn}</p>
  )
};
