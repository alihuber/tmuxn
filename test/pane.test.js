const Pane = require('../lib/pane').Pane;

const stringYaml = 'start this';
const objArrayYaml = { logs: ['ssh logs@example.com', 'cd /var/logs', 'tail -f development.log'] };

const windowYaml = { logs: null, pre: 'pre-foo', layout: 'main-vertical', panes: [objArrayYaml, objArrayYaml] };

const noPreWindowYaml = { logs: null, layout: 'main-vertical', panes: [objArrayYaml, objArrayYaml] };

const window = {
  loadedData: {
    name: 'test',
    root: '/Users/foo',
    pre_window: 'pre-window',
    windows: ['', ''],
    baseIndex: '1',
    paneBaseIndex: '1',
    tmux: 'tmux',
  },
  windowYaml: { logs: null, pre: 'foo', layout: 'main-vertical', panes: ['start this', 'start that'] },
  name: 'small_project',
  index: 1,
  commands: [],
  root: '-c /Users/foo',
  winTarget: 'test:3',
};

const fullProjectData = {
  name: 'test',
  root: '/Users/foo',
  pre_window: 'pre-window',
  windows: [{ server: 'bundle exec rails s' }, { small_project: null, root: '~/projects/company/small_project', panes: [{}] }],
  baseIndex: '1',
  paneBaseIndex: '1',
  tmux: 'tmux',
};

const noPreProjectData = {
  name: 'test',
  root: '/Users/foo',
  windows: [{ server: 'bundle exec rails s' }, { small_project: null, root: '~/projects/company/small_project', panes: [{}] }],
  baseIndex: '1',
  paneBaseIndex: '1',
  tmux: 'tmux',
};

const expectedPaneObj = {
  commands: ['ssh logs@example.com', 'cd /var/logs', 'tail -f development.log'],
  index: 1,
  loadedData: {
    baseIndex: '1',
    name: 'test',
    paneBaseIndex: '1',
    pre_window: 'pre-window',
    root: '/Users/foo',
    tmux: 'tmux',
    windows: [{ server: 'bundle exec rails s' }, { panes: [{}], root: '~/projects/company/small_project', small_project: null }],
  },
  paneYaml: { logs: ['ssh logs@example.com', 'cd /var/logs', 'tail -f development.log'] },
  window: {
    commands: [],
    index: 1,
    loadedData: {
      baseIndex: '1',
      name: 'test',
      paneBaseIndex: '1',
      pre_window: 'pre-window',
      root: '/Users/foo',
      tmux: 'tmux',
      windows: ['', ''],
    },
    name: 'small_project',
    windowYaml: { panes: ['start this', 'start that'] },
  },
  windowYaml: {
    layout: 'main-vertical',
    logs: null,
    panes: [
      { logs: ['ssh logs@example.com', 'cd /var/logs', 'tail -f development.log'] },
      { logs: ['ssh logs@example.com', 'cd /var/logs', 'tail -f development.log'] },
    ],
    pre: 'pre-foo',
  },
};

describe('pane class', () => {
  test('it has a constructor', () => {
    expect(new Pane(objArrayYaml, 1, windowYaml, window, fullProjectData)).toMatchObject(expectedPaneObj);
  });

  test('it returns the pre window command', () => {
    expect(new Pane(objArrayYaml, 1, windowYaml, window, fullProjectData).preWindowCommand()).toMatch(
      'tmux send-keys -t test:2.2 pre-window C-m'
    );
  });

  test('it returns undefined when there is no pre window command', () => {
    expect(new Pane(objArrayYaml, 1, windowYaml, window, noPreProjectData).preWindowCommand()).toBeUndefined();
  });

  test('it returns the pre tab command', () => {
    expect(new Pane(objArrayYaml, 1, windowYaml, window, fullProjectData).preTabCommand()).toMatch(
      'tmux send-keys -t test:2.2 pre-foo C-m'
    );
  });

  test('it returns undefined when there is no pre tab command', () => {
    expect(new Pane(objArrayYaml, 1, noPreWindowYaml, window, fullProjectData).preTabCommand()).toBeUndefined();
  });

  test('it returns the pane commands', () => {
    let expectedCommandsAry = [
      'tmux send-keys -t test:2.2 ssh\\ logs@example.com C-m',
      'tmux send-keys -t test:2.2 cd\\ /var/logs C-m',
      'tmux send-keys -t test:2.2 tail\\ -f\\ development.log C-m',
    ];

    expect(new Pane(objArrayYaml, 1, windowYaml, window, fullProjectData).paneCommands()).toMatchObject(expectedCommandsAry);
  });

  test('it returns the pane commands with no array', () => {
    expect(new Pane(stringYaml, 1, windowYaml, window, fullProjectData).paneCommands()).toMatchObject([
      'tmux send-keys -t test:2.2 start\\ this C-m',
    ]);
  });

  test('it returns the split command', () => {
    expect(new Pane(objArrayYaml, 1, windowYaml, window, fullProjectData).splitCommand()).toMatch('tmux splitw -c /Users/foo -t test:3');
  });
});
