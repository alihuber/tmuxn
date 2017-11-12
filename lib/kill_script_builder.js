const path           = require("path");
const expandHomeDir  = require("expand-home-dir");

const SessionChecker = require("./session_checker").SessionChecker;

module.exports.KillScriptBuilder = class KillScriptBuilder {

  constructor(loadedData) {
    this.loadedData     = loadedData;
    this.tmuxBinCommand = this._buildTmuxBinCommand();
    this._buildTmuxCommand();
  }

  buildScript() {
    let isSessionStarted =
      new SessionChecker(this.tmuxBinCommand, this.loadedData.name)
        .sessionStarted()
    if(isSessionStarted) {
      let lines = [];
      lines.push(_shebangLine());
      lines.push(_rootPathLine());
      lines.push(_killSessionCommand());
      lines.push(_onProjectStopLine());
      // flatten array
      lines = [].concat.apply([], lines);
      // filter out empty strings
      lines = lines.filter(String);
      return lines;
    } else {
      return "";
    }
  }

  _onProjectStopLine() {
    return "on_project_stop" in this.loadedData ?
      this.loadedData.on_project_stop : "";
  }

  _killSessionCommand() {
    return `${this.loadedData.tmux} kill-session -t ${this.loadedData.name}`;
  }

  _rootPathLine() {
    let rootPath = ".";
    if("root" in this.loadedData) {
      if(this.loadedData.root[0] == "~") {
        rootPath = `${expandHomeDir(this.loadedData.root)}`;
      } else {
        rootPath = `${path.resolve(this.loadedData.root)}`;
      }
    }
    this.loadedData.root = rootPath;
    return `cd ${rootPath}`;
  }

  _shebangLine() {
    let sh  = process.env.SHELL;
    let cmd = sh ? sh : "/bin/bash";
    return `#!${cmd}`;
  }

  _buildTmuxCommand() {
    let options = this.loadedData.tmux_options || "";
    options     = options.lenth > 0 ? " " + options : options;
    let socket  = "";

    if(this.loadedData.socket_name) {
      socket = ` -L ${this.loadedData.socket_name}`;
    }

    this.loadedData.tmux = `${this.tmuxBinCommand}${options}${socket}`;
    return this.loadedData.tmux;
  }

  _buildTmuxBinCommand() {
    return this.loadedData.tmux_command || "tmux";
  }
}
