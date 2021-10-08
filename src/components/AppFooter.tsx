import React from "react";
import { LogoutButton } from "./LogoutButton";
import { Seperator } from "./Seperator";

export const AppFooter: React.FC<{}> = () => {
  return (
    <div>
      <Seperator />
      <div className="container p-0 pb-2 appear-with-fade-in">
        <div className="row">
          <div className="col text-center">
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  )
};
