import React from "react";

const TimerDisplay = ({ breakOngoing, displayText }) => {
  return (
    <div id="time-left-label-container">
      <p id="timer-label" className="text-muted text-spaced text-center">
        {breakOngoing ? "BREAK" : "SESSION"}
      </p>
      <p id="time-left" className="text-center">
        {displayText}
      </p>
    </div>
  );
};

export default TimerDisplay;
