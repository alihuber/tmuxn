jest.mock('xdg-basedir');
jest.mock('fs');
jest.mock('shelljs');
jest.mock('js-yaml');
const utils = require("../lib/utils");

describe('project file utils', () => {

  test('it returns the config folder without xdg', () => {
    expect(utils.determineConfigFolder()).toMatch("/.tmuxn");
  });

  test('it returns the projectFile', () => {
    expect(utils.determineProjectFile("foo")).toMatch(".tmuxn/foo.yml");
  });

  test('it creates a sample project', () => {
    expect(utils.createNewProjectWithName("foo")).toBeUndefined();
  });

  test('it parses a project file', () => {
    expect(utils.parseYamlByName("foo")).toMatchObject({"name": "$$name$$",
      "root": "~/",
      "windows": [{"editor": {"layout": "main-vertical",
        "panes": ["vim", "mongod"]}}, {"server": "node app.js"},
        {"logs": "tail -f access.log"}]}
    );
  });

  test('it checks for the tmux binary', () => {
    expect(utils.checkHealth()).toBeUndefined();
  });
});
