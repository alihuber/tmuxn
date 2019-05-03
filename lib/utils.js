const os               = require('os');
const fs               = require('fs');
const shell            = require("shelljs");
const yaml             = require('js-yaml');
const xdgBasedir       = require('xdg-basedir');
const { getInstalledPathSync } = require('get-installed-path');

const tmuxnHomeFolder  = "/.tmuxn";
const tmuxnFolder      = "/tmuxn";
let installPath        = ".";
try {
  installPath          = getInstalledPathSync('tmuxn');
} catch (e) {
  // we are in dev mode, do nothing...
}

module.exports.determineConfigFolder = () => {
  var basePath;
  var configPath;
  if(xdgBasedir.config) {
    basePath   = xdgBasedir.config;
    configPath = basePath + tmuxnFolder;
  } else {
    basePath   = os.homedir();
    configPath = basePath + tmuxnHomeFolder;
  }
  if(!fs.existsSync(configPath)) {
    fs.mkdirSync(configPath);
  }
  return configPath;
}

module.exports.determineProjectFile = (projectName) => {
  let baseFolder  = this.determineConfigFolder();
  let projectFile = `${baseFolder}/${projectName}.yml`;
  return projectFile;
}

module.exports.createNewProjectWithName = projectName => {
  let projectFile = this.determineProjectFile(projectName);
  let samplePath  = `${installPath}/assets/sample.yml`;
  let sampleFile  = fs.readFileSync(samplePath, "utf-8")
                      .replace(/\$\$name\$\$/g, projectName);
  fs.writeFileSync(projectFile, sampleFile, 'utf-8', (err) => {
    if(err) throw err;
  });
  console.log(`Created project file: ${projectFile}`);
}

module.exports.parseYamlByName = projectName => {
  let configPath  = this.determineProjectFile(projectName);
  let fileContent = fs.readFileSync(configPath,  'utf8');
  let loadedData  = yaml.safeLoad(fs.readFileSync(configPath, 'utf8'));
  return loadedData;
}

module.exports.parseYamlByFileName = (projectFileName, root) => {
  let configPath  = projectFileName;
  let fileContent = fs.readFileSync(configPath,  'utf8');
  let loadedData  = yaml.safeLoad(fs.readFileSync(configPath, 'utf8'));
  if(root !== 'undefinded'){
    loadedData.root = root;
  }
  return loadedData;
}

module.exports.checkFile = fileName => {
  try {
    if (fs.existsSync(fileName)) {
      //file exists
      return true;
    }
  } catch(err) {
    console.error(err);
  }
  return false;
}

module.exports.checkHealth = () => {
  if (!shell.which('tmux')) {
    shell.echo('tmux is not installed, aborting...');
    shell.exit(1);
  }
}
