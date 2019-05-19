const Window = require('../lib/window').Window;

const simpleWindowYaml = { server: 'node app.js', synchronize: 'after', root: '/Users/bar' };
const simpleLayoutWindowYaml = { server: 'node app.js', layout: 'main-vertical' };
const commandlessWindowYaml = { server: ['', 'node app.js'] };
const noNameWindowYaml = { '': 'node app.js', synchronize: 'after' };
const mutipleCommandsWindowYaml = { stats: ['ssh stats@example.com', 'tail -f /var/log/stats.log'] };
const paneWindowYaml = { logs: null, pre: 'foo', layout: 'main-vertical', panes: [{ logs: {} }] };

const loadedYaml = {
  name: 'test',
  root: '/Users/foo',
  pre_window: 'pre-window',
  windows: [{ server: 'node app.js', synchronize: 'after' }, { stats: {} }, { logs: null, pre: 'foo', layout: 'main-vertical', panes: {} }],
  baseIndex: '1',
  paneBaseIndex: '1',
  tmux: 'tmux',
};

const rootlessLoadedYaml = {
  name: 'test',
  pre_window: 'pre-window',
  windows: [{ server: 'node app.js', synchronize: 'after' }, { stats: {} }, { logs: null, pre: 'foo', layout: 'main-vertical', panes: {} }],
  baseIndex: '1',
  paneBaseIndex: '1',
  tmux: 'tmux',
};

const expectedSimpleWindow = {
  commands: ['tmux send-keys -t test:2 node\\ app.js C-m'],
  index: 1,
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
  name: 'server',
  panes: [],
  windowYaml: {
    server: 'node app.js',
    synchronize: 'after',
  },
};

const expectedMultipleCommandWindow = {
  commands: ['tmux send-keys -t test:2 ssh\\ stats@example.com C-m', 'tmux send-keys -t test:2 tail\\ -f\\ /var/log/stats.log C-m'],
  index: 1,
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
  name: 'stats',
  panes: [],
  windowYaml: {
    stats: ['ssh stats@example.com', 'tail -f /var/log/stats.log'],
  },
};

describe('window class', () => {
  test('it has a constructor for simple configs', () => {
    expect(new Window(simpleWindowYaml, 1, loadedYaml)).toMatchObject(expectedSimpleWindow);
  });

  test('it has a constructor for command configs', () => {
    expect(new Window(mutipleCommandsWindowYaml, 1, loadedYaml)).toMatchObject(expectedMultipleCommandWindow);
  });

  test('it has a constructor for pane configs', () => {
    expect(new Window(paneWindowYaml, 1, loadedYaml).panes.length).toBe(1);
  });

  test('it returns the window name option', () => {
    expect(new Window(simpleWindowYaml, 1, loadedYaml).tmuxWindowNameOption()).toMatch('-n server');
  });

  test('it returns empty string when no name given', () => {
    expect(new Window(noNameWindowYaml, 1, loadedYaml).tmuxWindowNameOption()).toMatch('');
  });

  test('it returns the window command prefix', () => {
    expect(new Window(simpleWindowYaml, 1, loadedYaml).tmuxWindowCommandPrefix()).toMatch('tmux send-keys -t test:2');
  });

  test('it returns the new window command', () => {
    expect(new Window(simpleWindowYaml, 1, loadedYaml).newWindowCommand()).toMatch('tmux new-window -c /Users/bar -t test:2 -n server');
  });

  test('it returns the tiled layout command', () => {
    expect(new Window(simpleWindowYaml, 1, loadedYaml).tiledLayoutCommand()).toMatch('tmux select-layout -t test:2 tiled');
  });

  test('it returns empty string if no layout command', () => {
    expect(new Window(simpleWindowYaml, 1, loadedYaml).layoutCommand()).toMatch('');
  });

  test('it returns the layout command', () => {
    expect(new Window(simpleLayoutWindowYaml, 1, loadedYaml).layoutCommand()).toMatch('tmux select-layout -t test:2 main-vertical');
  });

  test('it returns empty string if no panes to select', () => {
    expect(new Window(simpleWindowYaml, 1, loadedYaml).selectFirstPane()).toMatch('');
  });

  test('it returns the select first pane command', () => {
    expect(new Window(paneWindowYaml, 1, loadedYaml).selectFirstPane()).toMatch('tmux select-pane -t test:2.1');
  });

  test('it returns empty string if there is no sync', () => {
    expect(new Window(simpleLayoutWindowYaml, 1, loadedYaml).syncAfterCommand()).toMatch('');
  });

  test('it returns the sync after command', () => {
    expect(new Window(simpleWindowYaml, 1, loadedYaml).syncAfterCommand()).toMatch('tmux set-window-option -t test:2 synchronize-panes on');
  });

  test('it returns the pre window command', () => {
    expect(new Window(simpleWindowYaml, 1, loadedYaml).preWindowCommand()).toMatch('tmux send-keys -t test:2 pre-window C-m');
  });

  test('it sets the root path if in yaml', () => {
    expect(new Window(simpleWindowYaml, 1, loadedYaml).newWindowCommand()).toMatch('tmux new-window -c /Users/bar -t test:2 -n server');
  });

  test('it falls back to project root path', () => {
    expect(new Window(simpleLayoutWindowYaml, 1, loadedYaml).newWindowCommand()).toMatch(
      'tmux new-window -c /Users/foo -t test:2 -n server'
    );
  });

  test('it falls back to "." if no root path set', () => {
    expect(new Window(simpleLayoutWindowYaml, 1, rootlessLoadedYaml).newWindowCommand()).toMatch(
      'tmux new-window -c . -t test:2 -n server'
    );
  });

  test('it omits empty commands', () => {
    expect(new Window(commandlessWindowYaml, 1, loadedYaml).commands).toMatchObject(['tmux send-keys -t test:2 node\\ app.js C-m']);
  });
});
