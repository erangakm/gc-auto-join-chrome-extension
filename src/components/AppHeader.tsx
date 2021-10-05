import React from "react";

export const AppHeader: React.FC<{}> = ({ children }) => {
  return (
    <>
      <img width={"35px"} alt="logo" src="./logo64.png"></img>
      <p style={{
        fontSize: "15px",
        fontWeight: 800,
      }}>Google Calendar assistant</p>
      <div id="seperator" style={{
        borderTop: "1px solid #b0b0b06e"
      }}>
      </div>
      <div style={{ padding: "8px", paddingTop: "0px" }}>
        {children}
      </div>
    </>
  )
};
