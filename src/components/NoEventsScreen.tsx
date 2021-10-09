import React from "react";

export const NoEventsScreen: React.FC<{}> = () => {
  const centerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }

  return (
    <div className="p-2 pt-3">
      <div className="image" style={centerStyle}>
        <img src="./empty_calendar.png" alt="no events" style={{ width: "100px" }}></img>
      </div>
      <div className="mt-2" style={{
        ...centerStyle,
        fontSize: "12px"
      }}>
        <p>You don't have any events with video meetings today.</p>
      </div>
    </div>
  )
};
