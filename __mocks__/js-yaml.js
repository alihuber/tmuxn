const yaml = jest.genMockFromModule('js-yaml');

function safeLoad (/*filePath*/) {
  return {
    name: '$$name$$',
    root: '~/',
    windows: [{ editor: { layout: 'main-vertical', panes: ['vim', 'mongod'] } }, { server: 'node app.js' }, { logs: 'tail -f access.log' }],
  };
}

yaml.safeLoad = safeLoad;
module.exports = yaml;
