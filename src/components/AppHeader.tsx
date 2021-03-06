import React from "react";
import { Seperator } from "./Seperator";

export const AppHeader: React.FC<{}> = ({ children }) => {
  return (
    <>
      <div className="container p-2 pt-3">
        <div className="row">
          <div className="col text-center">
            <img className="mr-2" alt="logo" src="./logo.png" style={{ height: "35px" }}></img>
          </div>
        </div>
        <div className="row">
          <div className="col text-center">
            <p style={{
                fontSize: "15px",
                fontWeight: 800,
                height: "35px",
                lineHeight: "35px",
                position: "relative",
                top: "4px",
              }} className="center mb-0 d-inline-block">Video meetings assistant</p>
          </div>
        </div>
      </div>
      <Seperator />
      <div>
        {children}
      </div>
    </>
  )
};
