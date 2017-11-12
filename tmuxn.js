#!/usr/bin/env node

const kexec         = require('kexec');
const shell         = require("shelljs");
const utils         = require('./lib/utils');
const ScriptBuilder = require('./lib/script_builder').ScriptBuilder;

let tmuxn = require('commander');
tmuxn
  .version('0.0.1')
  .usage('[new/start] <project_name>')
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
    utils.checkHealth();
    let loadedData  = utils.parseYamlByName(tmuxn.start);
    _checkLoadedData(loadedData);
    let execString  = new ScriptBuilder(loadedData).buildScript();
    // kexec(execString);
  }
  if(tmuxn.create) {
    utils.checkHealth();
    utils.createNewProjectWithName(tmuxn.create);
  }
  if(tmuxn.kill) {
    // TODO implement kill template
  }
  if(tmuxn.debug) {
    utils.checkHealth();
    let loadedData  = utils.parseYamlByName(tmuxn.debug);
    _checkLoadedData(loadedData);
    let execString  = new ScriptBuilder(loadedData).buildScript();
    console.log(execString);
  }
} catch (e) {
  console.log(e);
}

function _checkLoadedData(loadedData) {
  if(!loadedData.name || !loadedData.windows) {
    shell.echo('The config file contains errors: no name or no windows set.');
    shell.exit(1);
  }
}
