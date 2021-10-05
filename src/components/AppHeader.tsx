import { Grid } from "@material-ui/core";
import React from "react";

export const AppHeader: React.FC<{}> = ({ children }) => {
  return (
    <>
      <Grid container style={{ padding: "8px", paddingBottom: "0px" }}>
        <Grid item xs={2}>
          <img width={"35px"} alt="logo" src="./logo64.png"></img>
        </Grid>
        <Grid item xs={10}>
          <p style={{
            fontSize: "15px",
            fontWeight: 800,
            marginTop: "4%",
            marginLeft: "-5%"
          }}>Google Calendar assistant</p>
        </Grid>
      </Grid>
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
