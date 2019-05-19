const Checker = require('../lib/session_checker').SessionChecker;

test('it has a constructor', () => {
  expect(new Checker('tmux', 'foo')).toMatchObject({ tmuxBin: 'tmux', name: 'foo' });
});

test('it checks if a session is started', () => {
  expect(new Checker('tmux', 'foo').sessionStarted()).toBe(false);
});
