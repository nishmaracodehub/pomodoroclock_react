import React from "react";

const Button = ({ startOrStopTimer, resetClock, startStopButtonStyles }) => {
  return (
    <div className="text-spaced text-center">
      <button id="start_stop" className="btn" onClick={startOrStopTimer}>
        <span className={startStopButtonStyles} />
      </button>
      <button id="reset" className="btn" onClick={resetClock}>
        <span className="fas fa-stop" />
      </button>
    </div>
  );
};

export default Button;
