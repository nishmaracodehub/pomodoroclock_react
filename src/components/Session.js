import React, { Component } from "react";

class Session extends Component {
  render() {
    return (
      <div className="length-settings-group flex-column-h-center">
        <p id="session-label" className="text-muted text-spaced">
          SESSION
        </p>
        <p id="session-length" className="settings-number">
          {this.props.sessionLength}
        </p>
        <div>
          <button
            disabled={this.props.timerIsRunning}
            id="session-increment"
            className="btn"
            onClick={() => {
              this.props.updateTimerSetting("sessionLength", 1);
            }}
          >
            <span className="fas fa-plus" />
          </button>
          <button
            disabled={this.props.timerIsRunning}
            id="session-decrement"
            className="btn"
            onClick={() => {
              this.props.updateTimerSetting("sessionLength", -1);
            }}
          >
            <span className="fas fa-minus" />
          </button>
        </div>
      </div>
    );
  }
}

export default Session;
