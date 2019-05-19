# tmuxn

Adhering to [Atwood's Law](https://blog.codinghorror.com/the-principle-of-least-power/), here comes the tmux session manager written for NodeJS similar to [tmuxinator](https://github.com/tmuxinator/tmuxinator) and [tmuxp](https://github.com/tony/tmuxp)

## Installation

Rudimentary tested with

- NodeJS 6.11.5/tmux 2.6/MacOS 10.13.1,
- NodeJS 6.11.5/tmux 2.6.3/Ubuntu 18.04 LTS,
- NodeJS 10.15.3/tmux 2.6.3/Ubuntu 18.04 LTS and
- NodeJS 10.15.2/tmux 2.9a/MacOS 10.14.4

Other or older versions of tmux are not tested or supported.

```
npm install -g tmuxn
```

## Usage

```
  Usage: tmuxn [--create/--start/--kill/--debug] <project_name>


  Options:

    -V, --version                output the version number
    -c, --create <project_name>  Create new project with name
    -s, --start <project_name>   Start project with name
    -k, --kill <project_name>    Kill project with name
    -d, --debug <project_name>   Print shell commands of project with name
    -p, --project <project_config> Provide project config file
    -r, --root <project_root>    Provide project root start point
    -h, --help                   output usage information
```

## What does it do?

- Start tmux sessions configured in .yml-files, tmuxinator-style
- Figure out where to store the config files (`$XDG_CONFIG_HOME/tmuxn` or `~/.tmuxn`)
- Docs / gotchas from tmuxinator should apply to tmuxn as well

## What does it not do?

- Depend on `$EDITOR`
- Do anything Ruby-specific
- Manage (copy/delete) the configuration files
- Provide bash completion

## Sample config

```yaml
# ~/.tmuxn/sample.yml

name: sample
root: ~/

# Optional tmux socket
# socket_name: foo

# Runs before everything. Use it to start daemons etc.
# pre: mongod

# Project hooks
# Runs on project start, always
# on_project_start: command
# Run on project start, the first time
# on_project_first_start: command
# Run on project start, after the first time
# on_project_restart: command
# Run on project exit ( detaching from tmux session )
# on_project_exit: command

# Runs in each window and pane before window/pane specific commands.
# Useful for setting up interpreter versions.
# pre_window: nvm use --lts

# Pass command line options to tmux. Useful for specifying a different tmux.conf.
# tmux_options: -f ~/.tmux.mac.conf

# Change the command to call tmux.  This can be used by derivatives/wrappers like byobu.
# tmux_command: byobu

# Specifies (by name or index) which window will be selected on project startup.
# If not set, the first window is used.
# startup_window: editor

# Specifies (by index) which pane of the specified window will be selected on project startup.
# If not set, the first pane is used.
# startup_pane: 1

# Controls whether the tmux session should be attached to automatically. Defaults to true.
# attach: false

# Runs after everything. Use it to attach to tmux with custom options etc.
# post: tmux -CC attach -t sample

windows:
  - editor:
    layout: main-vertical
    # Synchronize all panes of this window after the pane commands.
    # synchronize: after
    panes:
      - vim
      - mongo
  - server: node app.js
  - logs: tail -f access.log
```
