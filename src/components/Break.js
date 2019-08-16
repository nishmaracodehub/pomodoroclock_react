import React, { Component } from "react";

class Break extends Component {
  render() {
    return (
      <div className="length-settings-group flex-column-h-center">
        <p id="break-label" className="text-muted text-spaced">
          BREAK
        </p>
        <p id="break-length" className="settings-number">
          {this.props.breakLength}
        </p>
        <div>
          <button
            disabled={this.props.timerIsRunning}
            id="break-increment"
            className="btn"
            onClick={() => {
              this.props.updateTimerSetting("breakLength", 1);
            }}
          >
            <span className="fas fa-plus" />
          </button>
          <button
            disabled={this.props.timerIsRunning}
            id="break-decrement"
            className="btn"
            onClick={() => {
              this.props.updateTimerSetting("breakLength", -1);
            }}
          >
            <span className="fas fa-minus" />
          </button>
        </div>
      </div>
    );
  }
}

export default Break;
