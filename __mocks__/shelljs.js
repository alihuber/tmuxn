const shell = jest.genMockFromModule('shelljs');

function which (/*str*/) {
  return undefined;
}

function exit (/*status*/) {
  return 1;
}

function exec (/*string*/) {
  return { stdout: 'base-index 1\npane-base-index 1\n' };
}

shell.which = which;
shell.exit = exit;
shell.exec = exec;
module.exports = shell;
