const shell  = require("shelljs");

module.exports.SessionChecker = class SessionChecker {

  constructor(tmuxBin, name) {
    this.tmuxBin = tmuxBin;
    this.name = name;
  }

  sessionStarted() {
    let sessions = shell.exec(`${this.tmuxBin} ls 2> /dev/null`);
    // exit status 0 == there are sessions
    if(sessions.code == 0) {
      return sessions.String.indexOf(`${this.name}:`) !== -1;
    }
    return false;
  }
}
