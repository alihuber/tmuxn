const Pane = require('./pane').Pane;
const shellwords = require('shellwords');

module.exports.Window = class Window {
  constructor (windowYaml, index, loadedData) {
    this.loadedData = loadedData;
    this.windowYaml = windowYaml;
    this.name = this._getWindowName();
    this.index = index;
    this.commands = this._buildWindowCommands();
    this.panes = this._buildPanes();
    this.root = this._getWindowRootPath();
    this.winTarget = this._getWindowTarget();
  }

  tmuxWindowNameOption () {
    if (!this.name) {
      return '';
    }
    return this.name.length != 0 ? `-n ${this.name}` : '';
  }

  tmuxWindowCommandPrefix () {
    let tmux = this.loadedData.tmux;
    let name = this.loadedData.name;
    let baseIndex = this.loadedData.baseIndex;
    let windowNum = Number(this.index) + Number(baseIndex);
    return `${tmux} send-keys -t ${name}:${windowNum}`;
  }

  newWindowCommand () {
    let nameOpt = this.tmuxWindowNameOption();
    return `${this.loadedData.tmux} new-window ${this.root} -t ${this.winTarget} ${nameOpt}`;
  }

  tiledLayoutCommand () {
    return `${this.loadedData.tmux} select-layout -t ${this._getWindowTarget()} tiled`;
  }

  layoutCommand () {
    let layout = this.windowYaml.layout;
    if (layout) {
      return `${this.loadedData.tmux} select-layout -t ${this._getWindowTarget()} ${shellwords.escape(layout)}`;
    } else {
      return '';
    }
  }

  selectFirstPane () {
    if (this.panes.length != 0) {
      let number = Number(this.panes[0].index) + Number(this.loadedData.baseIndex);
      return `${this.loadedData.tmux} select-pane -t ${this._getWindowTarget()}.${number}`;
    } else {
      return '';
    }
  }

  syncAfterCommand () {
    if (this.windowYaml.synchronize) {
      return `${this.loadedData.tmux} set-window-option -t ${this._getWindowTarget()} synchronize-panes on`;
    } else {
      return '';
    }
  }

  preWindowCommand () {
    return `${this.loadedData.tmux} send-keys -t ${this._getWindowTarget()} ${shellwords.escape(this.loadedData.pre_window)} C-m`;
  }

  _getWindowName () {
    let yamlName = Object.keys(this.windowYaml)[0];
    return yamlName ? shellwords.escape(yamlName) : '';
  }

  _buildWindowCommands () {
    // 3 cases:
    // the window has just a string as command,
    // it has an array with consecutive commands
    // it has panes and the commands are in there, see _buildPanes()
    for (var key in this.windowYaml) {
      var command = this.windowYaml[key];
      if (typeof command === 'string') {
        return [`${this.tmuxWindowCommandPrefix()} ${shellwords.escape(command)} C-m`];
      } else if (Array.isArray(command)) {
        let result = [];
        for (const com of command) {
          if (com && com.length !== 0) {
            result.push(`${this.tmuxWindowCommandPrefix()} ${shellwords.escape(com)} C-m`);
          }
        }
        return result;
      } else {
        return [];
      }
    }
  }

  _buildPanes () {
    let result = [];
    let panes = this.windowYaml.panes;
    if (panes && panes.length != 0) {
      for (var i = 0; i < panes.length; i++) {
        result.push(new Pane(panes[i], i, this.windowYaml, this, this.loadedData));
      }
    }
    return result;
  }

  _getWindowRootPath () {
    // get window root folder, fallback to project setting, fallback to "."
    let root = '.';
    let path = '';
    if ('root' in this.windowYaml) {
      root = shellwords.escape(this.windowYaml.root);
    } else if ('root' in this.loadedData) {
      root = shellwords.escape(this.loadedData.root);
    }
    path = `-c ${root}`;
    return path;
  }

  _getWindowTarget () {
    let indexNum = this.index + Number(this.loadedData.baseIndex);
    return `${this.loadedData.name}:${indexNum}`;
  }
};
