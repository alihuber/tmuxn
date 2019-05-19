const fs = jest.genMockFromModule('fs');

const mockYaml = `
name: foo
root: ~/
windows:
  - editor:
    layout: main-vertical
    panes:
      - vim
      - mongo
  - server: node app.js
  - logs: tail -f access.log
`;

function existsSync (/* directoryPath */) {
  return true;
}

function writeFileSync (/*target, source, encoding, callback*/) {
  return true;
}

function readFileSync (/*file, encoding*/) {
  return mockYaml;
}

fs.existsSync = existsSync;
fs.writeFileSync = writeFileSync;
fs.readFileSync = readFileSync;
module.exports = fs;
