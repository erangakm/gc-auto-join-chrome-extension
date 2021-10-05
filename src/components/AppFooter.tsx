import React from "react";
import { LogoutButton } from "./LogoutButton";
import { Seperator } from "./Seperator";

export const AppFooter: React.FC<{}> = () => {
  return (
    <div>
      <Seperator />
      <div className="container">
        <div className="row">
          <div className="col text-center">
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  )
};
