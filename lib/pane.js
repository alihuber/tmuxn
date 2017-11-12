const shellwords = require('shellwords');

module.exports.Pane = class Pane {

  constructor(paneYaml, index, windowYaml, window, projectData) {
    this.paneYaml   = paneYaml;
    this.index      = index;
    this.windowYaml = windowYaml;
    this.window     = window;
    this.loadedData = projectData;
    this.commands   = this._buildCommands();
  }


  preWindowCommand() {
    if("pre_window" in this.loadedData) {
      return `${this.loadedData.tmux} send-keys -t ${this._getWindowPaneTarget()} ${shellwords.escape(this.loadedData.pre_window)} C-m`;
    }
  }


  preTabCommand() {
    if("pre" in this.windowYaml) {
      return `${this.loadedData.tmux} send-keys -t ${this._getWindowPaneTarget()} ${shellwords.escape(this.windowYaml.pre)} C-m`;
    }
  }


  paneCommands() {
    var result = [];
    for(var i = 0; i < this.commands.length; i++) {
      let outString = `${this.loadedData.tmux} send-keys -t ${this._getWindowPaneTarget()} ${shellwords.escape(this.commands[i])} C-m`;
      result.push(outString);
    }
    return result;
  }


  splitCommand() {
    return `${this.loadedData.tmux} splitw ${this.window.root} -t ${this.window.winTarget}`;
  }


  _buildCommands() {
    if(typeof this.paneYaml === "string") {
      return [this.paneYaml];
    } else {
      let result = [];
      for(var key in this.paneYaml) {
        var command = this.paneYaml[key];
        result.push(command);
      }
      result = [].concat.apply([], result);
      return result;
    }
  }

  _getWindowPaneTarget() {
    return `${this.loadedData.name}:${this._getWindowIndex()}.${this._getPaneIndex()}`;
  }

  _getWindowIndex() {
    return Number(this.window.index) + Number(this.loadedData.baseIndex);
  }

  _getPaneIndex() {
    return Number(this.index) + Number(this.loadedData.baseIndex);
  }
}
