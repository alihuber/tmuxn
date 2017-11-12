const Options = require("../lib/tmux_options").TmuxOptions;

test('it has a constructor', () => {
  expect(new Options("tmux")).toMatchObject({tmuxBin: "tmux"});
});

test('it returns an options String', () => {
  expect(new Options("tmux").options())
    .toMatchObject({"base-index": "1", "pane-base-index": "1"});
});
