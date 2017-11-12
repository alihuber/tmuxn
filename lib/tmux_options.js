const shell  = require("shelljs");

module.exports.TmuxOptions = class TmuxOptions {
  constructor(tmuxBin) {
    this.tmuxBin = tmuxBin;
  }


  options() {
    return this._getTmuxOptions();
  }

  _getTmuxOptions() {
    let config = shell.exec(this.tmuxBin + " start-server\\; " + 
      "show-option -g base-index\\; " + 
      "show-window-option -g pane-base-index\\;", {silent: true});
    let optsAry = config.stdout.split("\n");
    let result  = {};
    for(var i = 0; i < optsAry.length; i++) {
      let optLine = optsAry[i];
      let option  = optLine.match(/\S+/g)
      if(option) {
        result[option[0]] = option[1];
      }
    }
    return result;
  }
}
