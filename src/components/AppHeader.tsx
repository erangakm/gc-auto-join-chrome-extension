import { Grid } from "@material-ui/core";
import React from "react";

export const AppHeader: React.FC<{}> = ({ children }) => {
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <img width={"50px"} alt="logo" src="./logo64.png"></img>
        </Grid>
        <Grid item xs={10}>
          <p>Google Calendar assistant</p>
        </Grid>
      </Grid>
      {children}
    </>
  )
};
