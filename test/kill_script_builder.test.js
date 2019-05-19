const KillScriptBuilder = require('../lib/kill_script_builder').KillScriptBuilder;

const simpleLoadedYaml = {
  name: 'test',
  root: '/Users/foo',
  pre_window: 'pre-window',
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

describe('kill script builder class', () => {
  test('it has a constructor', () => {
    expect(new KillScriptBuilder(simpleLoadedYaml)).toMatchObject(expectedScriptBuilder);
  });

  test('it builds a script', () => {
    expect(new KillScriptBuilder(simpleLoadedYaml).buildScript()).toMatch('');
  });
});
