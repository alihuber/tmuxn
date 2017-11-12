const TmuxOptions    = require("./tmux_options").TmuxOptions;
const ProjectData    = require("./project_data").ProjectData;
const SessionChecker = require("./session_checker").SessionChecker;
const path           = require("path");
const expandHomeDir  = require("expand-home-dir");
const shellwords     = require("shellwords");

module.exports.ScriptBuilder = class ScriptBuilder {

  constructor(loadedData) {
    this.loadedData               = loadedData;
    this.tmuxBinCommand           = this._buildTmuxBinCommand();
    this.loadedData.baseIndex     = this._getBaseIndex();
    this.loadedData.paneBaseIndex = this._getPaneBaseIndex();
  }

  buildScript() {
    let lines = [];
    // general commands: shebang, start server, root path
    lines.push(this._shebangLine());
    lines.push(this._startServerLine());
    lines.push(this._rootPathLine());
    lines.push(this._onProjectStartLine());

    // followed by lines regarding the project itself
    let isSessionStarted =
      new SessionChecker(this.tmuxBinCommand, this.loadedData.name)
        .sessionStarted()
    if(isSessionStarted) {
      lines.push(this._onProjectRestartLine());
    } else {
      lines.push(this._preLine());
      lines.push(this._onProjectFirstStartLine());

      // now get project/window/pane specific lines
      lines.push(this._projectLines());

      // everything else
      lines.push(this._startupWindowLine());
      lines.push(this._startupPaneLine());
      lines.push(this._attachLines());
      lines.push(this._postLine());
      lines.push(this._onProjectExitLine());
      // flatten array
      lines = [].concat.apply([], lines);
      // filter out empty strings
      lines = lines.filter(String);
    }
    return lines.join("\n");
  }


  _buildTmuxBinCommand() {
    return this.loadedData.tmux_command || "tmux";
  }

  _getBaseIndex() {
    return new TmuxOptions(this.tmuxBinCommand)
      .options()["base-index"];
  }

  _getPaneBaseIndex() {
    return new TmuxOptions(this.tmuxBinCommand)
      .options()["pane-base-index"];
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

  _startServerLine() {
    return `${this._buildTmuxCommand()} start-server;`;
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

  _onProjectRestartLine() {
    return "on_project_restart" in this.loadedData ?
      this.loadedData.on_project_restart : "";
  }

  _onProjectStartLine() {
    return "on_project_start" in this.loadedData ?
      this.loadedData.on_project_start : "";
  }

  _attachLines() {
    // default to true, ignore everything else than false
    if("attach" in this.loadedData && this.loadedData.attach == false) {
      return "";
    } else {
      return `if [ -z "$TMUX" ]; then
        ${this.loadedData.tmux} -u attach-session -t ${this.loadedData.name}
      else
        ${this.loadedData.tmux} -u switch-client -t ${this.loadedData.name}
      fi`;
    }
  }

  _startupPaneLine() {
    return `${this.loadedData.tmux} select-pane -t ${this._startupPane()}`;
  }

  _startupPane() {
    let pane          = "startup_pane" in this.loadedData ?
      this.loadedData.startup_pane : this.loadedData.paneBaseIndex;
    let startupWindow = this._startupWindow();
    return `${startupWindow}.${pane}`;
  }

  _startupWindow() {
    let window        = "startup_window" in this.loadedData ?
      this.loadedData.startup_window : this.loadedData.baseIndex;
    let name          = this.loadedData.name;
    return `${name}:${window}`;
  }

  _startupWindowLine() {
    return `${this.loadedData.tmux} select-window -t ${this._startupWindow()}`;
  }

  _projectLines() {
    return new ProjectData(this.loadedData).getProjectLines();
  }

  _preLine() {
    return "pre" in this.loadedData ?
      this.loadedData.pre : "";
  }

  _onProjectFirstStartLine() {
    return "on_project_first_start" in this.loadedData ?
      this.loadedData.on_project_first_start : "";
  }

  _postLine() {
    return "post" in this.loadedData ?
      this.loadedData.post : "";
  }

  _onProjectExitLine() {
    if("attach" in this.loadedData && this.loadedData.attach == false) {
      return "on_project_exit" in this.loadedData ?
        this.loadedData.on_project_exit : "";
    } else {
      return "";
    }
  }
}
