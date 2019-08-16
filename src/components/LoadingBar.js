import React from "react";

const LoadingBar = ({ loadingBarWidth }) => {
  return (
    <div className="loading-bar-bg">
      <div className="loading-bar" style={{ width: loadingBarWidth + "%" }} />
    </div>
  );
};

export default LoadingBar;
