import React, { Component } from "react";
import Break from "./Break";
import Session from "./Session";
import Header from "./Header";
import Button from "./Button";
import LoadingBar from "./LoadingBar";
import TimerDisplay from "./TimerDisplay";

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
        <div id="clock-container">
          <Header />
          <TimerDisplay
            breakOngoing={this.state.breakOngoing}
            displayText={displayText}
          />
          <Button
            startOrStopTimer={this.startOrStopTimer}
            resetClock={this.resetClock}
            startStopButtonStyles={startStopButtonStyles}
          />
          <LoadingBar loadingBarWidth={this.state.loadingBarWidth} />
          <div id="length-settings-group-container">
            <Break
              timerIsRunning={this.state.timerIsRunning}
              breakLength={this.state.breakLength}
              updateTimerSetting={this.updateTimerSetting}
            />
            <Session
              sessionLength={this.state.sessionLength}
              updateTimerSetting={this.updateTimerSetting}
              timerIsRunning={this.state.timerIsRunning}
            />
          </div>
          <audio id="beep" preload="auto" src="https://goo.gl/65cBl1" />
        </div>
      </main>
    );
  }
}

export default PomodoroClock;
