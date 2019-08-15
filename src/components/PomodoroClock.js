import React, { Component } from "react";

class PomodoroClock extends Component {
  constructor() {
    super();
    this.resetClock = this.resetClock.bind(this);
    this.updateTimerSetting = this.updateTimerSetting.bind(this);
    this.startOrStopTimer = this.startOrStopTimer.bind(this);
    this.countDownOneSecond = this.countDownOneSecond.bind(this);
  }

  state = {
    breakLength: 5,
    breakLengthLeft: 5,
    sessionLength: 25,
    sessionLengthLeft: 25,
    timerIsRunning: false,
    seconds: 0,
    intervalHandle: 0,
    breakOngoing: false,
    displayTextBetweenSessions: "",
    loadingBarWidth: 100
  };

  startOrStopTimer() {
    this.setState({ timerIsRunning: !this.state.timerIsRunning });
    if (this.state.timerIsRunning) clearInterval(this.state.intervalHandle);
    else {
      let handle = setInterval(this.countDownOneSecond, 1000);
      this.setState({ intervalHandle: handle });
    }
  }

  resetClock() {
    this.setState({
      breakLength: 5,
      breakLengthLeft: 5,
      sessionLength: 25,
      sessionLengthLeft: 25,
      seconds: 0,
      timerIsRunning: false,
      breakOngoing: false,
      loadingBarWidth: 100
    });
    clearInterval(this.state.intervalHandle);
    document.getElementById("beep").pause();
    document.getElementById("beep").currentTime = 0;
  }

  // Increases or decreases the specified timer (sessionTimer or breakTimer) by 1 minute if no timer is currently running
  updateTimerSetting(timerName, timeAmount) {
    if (this.state.timerIsRunning) return;

    if (
      this.state[timerName] + timeAmount >= 1 &&
      this.state[timerName] + timeAmount <= 60
    ) {
      const timerNameLeft = timerName + "Left";
      this.setState(prevState => ({
        [timerName]: prevState[timerName] + timeAmount,
        [timerNameLeft]: prevState[timerName] + timeAmount
      }));
    }
  }

  countDownOneSecond() {
    if (this.state.seconds - 1 < 0) {
      // The block below manages the minute-timer when a break is going on
      if (this.state.breakOngoing) {
        if (this.state.breakLengthLeft - 1 < 0) {
          this.setState({
            breakLengthLeft: this.state.breakLength,
            breakOngoing: false,
            displayTextBetweenSessions: "SESSION"
          });
          setTimeout(() => {
            this.setState({ displayTextBetweenSessions: "" });
          }, 1000);
          document.getElementById("beep").play();
        } else
          this.setState(prevState => ({
            breakLengthLeft: prevState.breakLengthLeft - 1,
            seconds: 59
          }));
      } else {
        // The block below manages the minute-timer when a session (no break) is going on
        if (this.state.sessionLengthLeft - 1 < 0) {
          this.setState({
            sessionLengthLeft: this.state.sessionLength,
            breakOngoing: true,
            displayTextBetweenSessions: "BREAK"
          });
          setTimeout(() => {
            this.setState({ displayTextBetweenSessions: "" });
          }, 1000);
          document.getElementById("beep").play();
        } else
          this.setState(prevState => ({
            sessionLengthLeft: prevState.sessionLengthLeft - 1,
            seconds: 59
          }));
      }
    }
    // Seconds decrease independently of break or session status
    else this.setState(prevState => ({ seconds: prevState.seconds - 1 }));

    // calculate and set new loading bar width
    const secondsLeft =
      (this.state.breakOngoing
        ? this.state.breakLengthLeft
        : this.state.sessionLengthLeft) *
        60 +
      this.state.seconds;
    const initialTimeInSeconds =
      (this.state.breakOngoing
        ? this.state.breakLength
        : this.state.sessionLength) * 60;
    const loadingBarWidth = (secondsLeft / initialTimeInSeconds) * 100;
    this.setState({ loadingBarWidth });
  }

  render() {
    // Gets last two digits (eg. 020 becomes 20, 07 becomes 7)
    const formattedSeconds = ("0" + this.state.seconds).slice(-2);
    const currentActiveTimerLeft = this.state.breakOngoing
      ? this.state.breakLengthLeft
      : this.state.sessionLengthLeft;
    const formattedMinutes = ("0" + currentActiveTimerLeft).slice(-2);
    let displayText = formattedMinutes + ":" + formattedSeconds;

    let startStopButtonStyles = this.state.timerIsRunning
      ? "fas fa-pause"
      : "fas fa-play";

    return (
      <main id="main" className="flex-column-h-center">
        <div className="flex-column-h-center" id="clock-container">
          <h1 id="main-heading" className="text-center text-muted">
            <span className="far fa-clock" /> Pomodoro Clock
          </h1>
          <div id="time-left-label-container">
            <p id="timer-label" className="text-muted text-spaced">
              {this.state.breakOngoing ? "BREAK" : "SESSION"}
            </p>
            <p id="time-left" className="text-center">
              {displayText}
            </p>
          </div>
          <div>
            <button
              id="start_stop"
              className="btn"
              onClick={this.startOrStopTimer}
            >
              <span className={startStopButtonStyles} />
            </button>
            <button id="reset" className="btn" onClick={this.resetClock}>
              <span className="fas fa-stop" />
            </button>
          </div>
          <div className="loading-bar-bg">
            <div
              className="loading-bar"
              style={{ width: this.state.loadingBarWidth + "%" }}
            />
          </div>
          <div id="length-settings-group-container">
            <div className="length-settings-group flex-column-h-center">
              <p id="break-label" className="text-muted text-spaced">
                BREAK
              </p>
              <p id="break-length" className="settings-number">
                {this.state.breakLength}
              </p>
              <div>
                <button
                  disabled={this.state.timerIsRunning}
                  id="break-increment"
                  className="btn"
                  onClick={() => {
                    this.updateTimerSetting("breakLength", 1);
                  }}
                >
                  <span className="fas fa-plus" />
                </button>
                <button
                  disabled={this.state.timerIsRunning}
                  id="break-decrement"
                  className="btn"
                  onClick={() => {
                    this.updateTimerSetting("breakLength", -1);
                  }}
                >
                  <span className="fas fa-minus" />
                </button>
              </div>
            </div>
            <div className="length-settings-group flex-column-h-center">
              <p id="session-label" className="text-muted text-spaced">
                SESSION
              </p>
              <p id="session-length" className="settings-number">
                {this.state.sessionLength}
              </p>
              <div>
                <button
                  disabled={this.state.timerIsRunning}
                  id="session-increment"
                  className="btn"
                  onClick={() => {
                    this.updateTimerSetting("sessionLength", 1);
                  }}
                >
                  <span className="fas fa-plus" />
                </button>
                <button
                  disabled={this.state.timerIsRunning}
                  id="session-decrement"
                  className="btn"
                  onClick={() => {
                    this.updateTimerSetting("sessionLength", -1);
                  }}
                >
                  <span className="fas fa-minus" />
                </button>
              </div>
            </div>
          </div>
          <audio id="beep" preload="auto" src="https://goo.gl/65cBl1" />
        </div>
      </main>
    );
  }
}

export default PomodoroClock;
