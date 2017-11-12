const shell      = require("shelljs");
const Window     = require("./window").Window;
const shellwords = require("shellwords");

module.exports.ProjectData = class ProjectData {

  constructor(loadedData) {
    this.loadedData = loadedData;
    this.windows    = this._loadWindowsData();
  }


  getProjectLines() {
    let lines = [];
    lines.push(this._tmuxNewSessionCommand());
    lines.push(this._firstWindowCommand());
    lines.push(this._newWindowCommandLines());
    lines.push(this._panelessWindowCommandLines());
    lines.push(this._paneCommandLines());
    lines.push(this._tmuxLayoutCommand());
    lines.push(this._selectFirstPaneCommand());
    lines.push(this._synchronizeAfterCommand());
    lines = [].concat.apply([], lines);

    return lines;
  }

  _synchronizeAfterCommand() {
    let result = [];
    for(const win of this.windows) {
      result.push(win.syncAfterCommand());
    }
    return result;
  }

  _selectFirstPaneCommand() {
    let result = [];
    for(const win of this.windows) {
      result.push(win.selectFirstPane());
    }
    return result;
  }

  _tmuxLayoutCommand() {
    let result = [];
    for(const win of this.windows) {
      result.push(win.layoutCommand());
    }
    return result;
  }

  _paneCommandLines() {
    let result = [];
    for(const win of this.windows) {
      if(win.panes.length !== 0) {
        win.panes.forEach(function(pane, i) {
          if("pre_window" in this.loadedData) {
            result.push(pane.preWindowCommand());
          }
          if(pane.preTabCommand()) {
            result.push(pane.preTabCommand());
          }

          result.push(pane.paneCommands());

          if(i !== win.panes.length - 1) {
            result.push(pane.splitCommand());
          }

          result.push(win.tiledLayoutCommand());
        }, this);
      }
    }
    result = [].concat.apply([], result);
    return result;
  }

  _panelessWindowCommandLines() {
    let result = [];
    for(const win of this.windows) {
      if(win.panes.length === 0) {
        if("pre_window" in this.loadedData) {
          result.push(win.preWindowCommand());
        }
        for (const command of win.commands) {
          result.push(command);
        }
      }
    }
    return result;
  }

  _newWindowCommandLines() {
    let result = [];
    // omit first window
    for(var i = 1; i < this.windows.length; i++) {
      result.push(this.windows[i].newWindowCommand());
    }
    return result;
  }

  _firstWindowCommand() {
    // if the window entry has the root property set, use it
    // otherwise fallback to project root
    let cmdPrefix = this.windows[0].tmuxWindowCommandPrefix();
    let root      = this.loadedData.root;
    if("root" in this.loadedData.windows[0]) {
      root = this.loadedData.windows[0].root;
    }
    let rootSegment = `cd ${root}`;
    return `${cmdPrefix} ${shellwords.escape(rootSegment)} C-m`;
  }

  _tmuxNewSessionCommand() {
    let window      = this.windows[0].tmuxWindowNameOption();
    let tmuxCommand = this.loadedData.tmux;
    let name        = shellwords.escape(this.loadedData.name);
    return `TMUX= ${this.loadedData.tmux} new-session -d -s ${name} ${window}`;
  }

  _loadWindowsData() {
    let result = [];
    for(var i = 0; i < this.loadedData.windows.length; i++) {
      result.push(new Window(this.loadedData.windows[i], i, this.loadedData));
    }
    return result;
  }
}
