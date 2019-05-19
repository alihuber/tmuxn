const ScriptBuilder = require('../lib/script_builder').ScriptBuilder;

const simpleLoadedYaml = {
  name: 'test',
  root: '/Users/foo',
  pre_window: 'pre-window',
  windows: [{ server: 'node app.js', synchronize: 'after' }, { stats: {} }, { logs: null, pre: 'foo', layout: 'main-vertical', panes: {} }],
  baseIndex: '1',
  paneBaseIndex: '1',
  tmux: 'tmux',
};

const projectStartYaml = {
  name: 'test',
  root: '/Users/foo',
  on_project_start: 'baz',
  pre_window: 'pre-window',
  windows: [{ server: 'node app.js', synchronize: 'after' }, { stats: {} }, { logs: null, pre: 'foo', layout: 'main-vertical', panes: {} }],
  baseIndex: '1',
  paneBaseIndex: '1',
  tmux: 'tmux',
};

const noAttachYaml = {
  name: 'test',
  root: '/Users/foo',
  attach: false,
  pre_window: 'pre-window',
  windows: [{ server: 'node app.js', synchronize: 'after' }, { stats: {} }, { logs: null, pre: 'foo', layout: 'main-vertical', panes: {} }],
  baseIndex: '1',
  paneBaseIndex: '1',
  tmux: 'tmux',
};

const socketOptionsYaml = {
  name: 'test',
  root: '/Users/foo',
  socket_name: 'qux',
  tmux_options: '-f ~/.tmux.mac.conf',
  windows: [{ server: 'node app.js', synchronize: 'after' }, { stats: {} }, { logs: null, pre: 'foo', layout: 'main-vertical', panes: {} }],
  baseIndex: '1',
  paneBaseIndex: '1',
  tmux: 'tmux',
};

const tildeRootYaml = {
  name: 'test',
  root: '~/',
  socket_name: 'qux',
  tmux_options: '-f ~/.tmux.mac.conf',
  windows: [{ server: 'node app.js', synchronize: 'after' }, { stats: {} }, { logs: null, pre: 'foo', layout: 'main-vertical', panes: {} }],
  baseIndex: '1',
  paneBaseIndex: '1',
  tmux: 'tmux',
};

const expectedScriptBuilder = {
  loadedData: {
    baseIndex: '1',
    name: 'test',
    paneBaseIndex: '1',
    pre_window: 'pre-window',
    root: '/Users/foo',
    tmux: 'tmux',
    windows: [
      {
        server: 'node app.js',
        synchronize: 'after',
      },
      {
        stats: {},
      },
      {
        layout: 'main-vertical',
        logs: null,
        panes: {},
        pre: 'foo',
      },
    ],
  },
  tmuxBinCommand: 'tmux',
};

const expectedScript = `#!/bin/bash
tmux start-server;
cd /Users/foo
TMUX= tmux new-session -d -s test -n server
tmux send-keys -t test:1 cd\\ /Users/foo C-m
tmux new-window -c /Users/foo -t test:2 -n stats
tmux new-window -c /Users/foo -t test:3 -n logs
tmux send-keys -t test:1 pre-window C-m
tmux send-keys -t test:1 node\\ app.js C-m
tmux send-keys -t test:2 pre-window C-m
tmux send-keys -t test:3 pre-window C-m
tmux select-layout -t test:3 main-vertical
tmux set-window-option -t test:1 synchronize-panes on
tmux select-window -t test:1
tmux select-pane -t test:1.1
if [ -z \"$TMUX\" ]; then
        tmux -u attach-session -t test
      else
        tmux -u switch-client -t test
      fi`;

const projectStartScript = `#!/bin/bash
tmux start-server;
cd /Users/foo
baz
TMUX= tmux new-session -d -s test -n server
tmux send-keys -t test:1 cd\\ /Users/foo C-m
tmux new-window -c /Users/foo -t test:2 -n stats
tmux new-window -c /Users/foo -t test:3 -n logs
tmux send-keys -t test:1 pre-window C-m
tmux send-keys -t test:1 node\\ app.js C-m
tmux send-keys -t test:2 pre-window C-m
tmux send-keys -t test:3 pre-window C-m
tmux select-layout -t test:3 main-vertical
tmux set-window-option -t test:1 synchronize-panes on
tmux select-window -t test:1
tmux select-pane -t test:1.1
if [ -z \"$TMUX\" ]; then
        tmux -u attach-session -t test
      else
        tmux -u switch-client -t test
      fi`;

const noAttachScript = `#!/bin/bash
tmux start-server;
cd /Users/foo
TMUX= tmux new-session -d -s test -n server
tmux send-keys -t test:1 cd\\ /Users/foo C-m
tmux new-window -c /Users/foo -t test:2 -n stats
tmux new-window -c /Users/foo -t test:3 -n logs
tmux send-keys -t test:1 pre-window C-m
tmux send-keys -t test:1 node\\ app.js C-m
tmux send-keys -t test:2 pre-window C-m
tmux send-keys -t test:3 pre-window C-m
tmux select-layout -t test:3 main-vertical
tmux set-window-option -t test:1 synchronize-panes on
tmux select-window -t test:1
tmux select-pane -t test:1.1`;

const socketOptionsScript = `#!/bin/bash
tmux-f ~/.tmux.mac.conf -L qux start-server;
cd /Users/foo
TMUX= tmux-f ~/.tmux.mac.conf -L qux new-session -d -s test -n server
tmux-f ~/.tmux.mac.conf -L qux send-keys -t test:1 cd\\ /Users/foo C-m
tmux-f ~/.tmux.mac.conf -L qux new-window -c /Users/foo -t test:2 -n stats
tmux-f ~/.tmux.mac.conf -L qux new-window -c /Users/foo -t test:3 -n logs
tmux-f ~/.tmux.mac.conf -L qux send-keys -t test:1 node\\ app.js C-m
tmux-f ~/.tmux.mac.conf -L qux select-layout -t test:3 main-vertical
tmux-f ~/.tmux.mac.conf -L qux set-window-option -t test:1 synchronize-panes on
tmux-f ~/.tmux.mac.conf -L qux select-window -t test:1
tmux-f ~/.tmux.mac.conf -L qux select-pane -t test:1.1
if [ -z \"$TMUX\" ]; then
        tmux-f ~/.tmux.mac.conf -L qux -u attach-session -t test
      else
        tmux-f ~/.tmux.mac.conf -L qux -u switch-client -t test
      fi`;

describe('script builder class', () => {
  test('it has a constructor', () => {
    expect(new ScriptBuilder(simpleLoadedYaml)).toMatchObject(expectedScriptBuilder);
  });

  test('it builds a script', () => {
    expect(new ScriptBuilder(simpleLoadedYaml).buildScript()).toMatch(expectedScript);
  });

  test('it uses project start hook', () => {
    expect(new ScriptBuilder(projectStartYaml).buildScript()).toMatch(projectStartScript);
  });

  test('it does not attach when configured', () => {
    expect(new ScriptBuilder(noAttachYaml).buildScript()).toMatch(noAttachScript);
  });

  test('it takes socket and tmux options', () => {
    expect(new ScriptBuilder(socketOptionsYaml).buildScript()).toMatch(socketOptionsScript);
  });

  test('it takes special care of "~" root paths', () => {
    expect(new ScriptBuilder(tildeRootYaml).buildScript()).not.toMatch(/cd\/Users\/foo/);
  });
});
