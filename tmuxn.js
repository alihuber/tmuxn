#!/usr/bin/env node

const kexec             = require('kexec');
const shell             = require("shelljs");
const utils             = require('./lib/utils');
const ScriptBuilder     = require('./lib/script_builder').ScriptBuilder;
const KillScriptBuilder = require('./lib/kill_script_builder').KillScriptBuilder;

let tmuxn = require('commander');
tmuxn
  .version('0.0.1')
  .usage('[--create/--start/--kill/--debug] <project_name>')
  .option('-c, --create <project_name>', 'Create new project with name')
  .option('-s, --start <project_name>',  'Start project with name')
  .option('-k, --kill <project_name>',   'Kill project with name')
  .option('-d, --debug <project_name>',  'Print shell commands of project with name')
  .parse(process.argv);

if(!tmuxn.create && !tmuxn.start && !tmuxn.kill && !tmuxn.debug) {
  console.log("Display possible commands with tmuxn --help");
  console.log("No option given, aborting...");
  process.exit(0);
}

try {
  if(tmuxn.start) {
    let loadedData = _loadCheckData(tmuxn.start);
    let execString = new ScriptBuilder(loadedData).buildScript();
    kexec(execString);
  }
  if(tmuxn.create) {
    utils.checkHealth();
    utils.createNewProjectWithName(tmuxn.create);
  }
  if(tmuxn.kill) {
    let loadedData = _loadCheckData(tmuxn.kill);
    let execString = new KillScriptBuilder(loadedData).buildScript();
    kexec(execString);
  }
  if(tmuxn.debug) {
    let loadedData = _loadCheckData(tmuxn.debug);
    let execString = new ScriptBuilder(loadedData).buildScript();
    console.log(execString);
  }
} catch (e) {
  console.log(e);
}

function _loadCheckData(name) {
  utils.checkHealth();
  let loadedData = utils.parseYamlByName(name);
  _checkLoadedData(loadedData);
  return loadedData;
}

function _checkLoadedData(loadedData) {
  if(!loadedData.name || !loadedData.windows) {
    shell.echo('The config file contains errors: no name or no windows set.');
    shell.exit(1);
  }
}
