const ProjectData = require('../lib/project_data').ProjectData;

const loadedYaml = {
  name: 'test',
  root: '/Users/foo',
  pre_window: 'pre-window',
  windows: [{ server: 'node app.js', synchronize: 'after' }, { stats: {} }, { logs: null, pre: 'foo', layout: 'main-vertical', panes: {} }],
  baseIndex: '1',
  paneBaseIndex: '1',
  tmux: 'tmux',
};

const multiplePaneLoadedYaml = {
  name: 'test',
  root: '/Users/foo',
  windows: [
    { server: 'node app.js', synchronize: 'after', root: '/Users/bar' },
    { stats: {} },
    { logs: null, pre: 'foo', layout: 'main-vertical', panes: [{}, {}] },
  ],
  baseIndex: '1',
  paneBaseIndex: '1',
  tmux: 'tmux',
};

const multiplePaneWithPreWindowYaml = {
  name: 'test',
  root: '/Users/foo',
  pre_window: 'pre-window',
  windows: [
    { server: 'node app.js', synchronize: 'after', root: '/Users/bar' },
    { stats: {} },
    { logs: null, pre: 'foo', layout: 'main-vertical', panes: [{}, {}] },
  ],
  baseIndex: '1',
  paneBaseIndex: '1',
  tmux: 'tmux',
};

const expectedProjectData = {
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
  windows: [
    {
      commands: ['tmux send-keys -t test:1 node\\ app.js C-m'],
      index: 0,
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
    },
    {
      commands: [],
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
        stats: {},
      },
    },
    {
      commands: [],
      index: 2,
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
      name: 'logs',
      panes: [],
      windowYaml: {
        layout: 'main-vertical',
        logs: null,
        panes: {},
        pre: 'foo',
      },
    },
  ],
};

const expectedProjectLines = [
  'TMUX= tmux new-session -d -s test -n server',
  'tmux send-keys -t test:1 cd\\ /Users/foo C-m',
  'tmux new-window -c /Users/foo -t test:2 -n stats',
  'tmux new-window -c /Users/foo -t test:3 -n logs',
  'tmux send-keys -t test:1 pre-window C-m',
  'tmux send-keys -t test:1 node\\ app.js C-m',
  'tmux send-keys -t test:2 pre-window C-m',
  'tmux send-keys -t test:3 pre-window C-m',
  '',
  '',
  'tmux select-layout -t test:3 main-vertical',
  '',
  '',
  '',
  'tmux set-window-option -t test:1 synchronize-panes on',
  '',
  '',
];

const expectedMultiplePaneProjectLines = [
  'TMUX= tmux new-session -d -s test -n server',
  'tmux send-keys -t test:1 cd\\ /Users/bar C-m',
  'tmux new-window -c /Users/foo -t test:2 -n stats',
  'tmux new-window -c /Users/foo -t test:3 -n logs',
  'tmux send-keys -t test:1 node\\ app.js C-m',
  'tmux send-keys -t test:3.1 foo C-m',
  'tmux splitw -c /Users/foo -t test:3',
  'tmux select-layout -t test:3 tiled',
  'tmux send-keys -t test:3.2 foo C-m',
  'tmux select-layout -t test:3 tiled',
  '',
  '',
  'tmux select-layout -t test:3 main-vertical',
  '',
  '',
  'tmux select-pane -t test:3.1',
  'tmux set-window-option -t test:1 synchronize-panes on',
  '',
  '',
];

const expectedMultiplePanePreWindowLines = [
  'TMUX= tmux new-session -d -s test -n server',
  'tmux send-keys -t test:1 cd\\ /Users/bar C-m',
  'tmux new-window -c /Users/foo -t test:2 -n stats',
  'tmux new-window -c /Users/foo -t test:3 -n logs',
  'tmux send-keys -t test:1 pre-window C-m',
  'tmux send-keys -t test:1 node\\ app.js C-m',
  'tmux send-keys -t test:2 pre-window C-m',
  'tmux send-keys -t test:3.1 pre-window C-m',
  'tmux send-keys -t test:3.1 foo C-m',
  'tmux splitw -c /Users/foo -t test:3',
  'tmux select-layout -t test:3 tiled',
  'tmux send-keys -t test:3.2 pre-window C-m',
  'tmux send-keys -t test:3.2 foo C-m',
  'tmux select-layout -t test:3 tiled',
  '',
  '',
  'tmux select-layout -t test:3 main-vertical',
  '',
  '',
  'tmux select-pane -t test:3.1',
  'tmux set-window-option -t test:1 synchronize-panes on',
  '',
  '',
];

describe('project data class', () => {
  test('it has a constructor', () => {
    expect(new ProjectData(loadedYaml)).toMatchObject(expectedProjectData);
  });

  test('it returns project lines', () => {
    expect(new ProjectData(loadedYaml).getProjectLines()).toMatchObject(expectedProjectLines);
  });

  test('it loads multiple pane configs', () => {
    expect(new ProjectData(multiplePaneLoadedYaml).getProjectLines()).toMatchObject(expectedMultiplePaneProjectLines);
  });

  test('it loads multiple pane with pre-window configs', () => {
    expect(new ProjectData(multiplePaneWithPreWindowYaml).getProjectLines()).toMatchObject(expectedMultiplePanePreWindowLines);
  });
});
