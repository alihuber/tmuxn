#!/usr/bin/env node

const kexec         = require('kexec');
const utils         = require('./lib/utils');
const ScriptBuilder = require('./lib/script_builder').ScriptBuilder;

let tmuxn = require('commander');
tmuxn
  .version('0.0.1')
  .usage('[new/start] <project_name>')
  .option('-c, --create <project_name>', 'Create new project with name')
  .option('-s, --start <project_name>',  'Start project with name')
  .option('-k, --kill <project_name>',  'Kill project with name')
  .parse(process.argv);

if(!tmuxn.create && !tmuxn.start && !tmuxn.kill) {
  console.log("Display possible commands with tmuxn --help");
  console.log("No option given, aborting...");
  process.exit(0);
}

try {
  if(tmuxn.start) {
    utils.checkHealth();
    let loadedData  = utils.parseYamlByName(tmuxn.start);
    // TODO: check root, project_name, windows are set
    let execString  = new ScriptBuilder(loadedData).buildScript();
    console.log(execString);
    // kexec(execString);
  }
  if(tmuxn.create) {
    utils.checkHealth();
    utils.createNewProjectWithName(tmuxn.create);
  }
  if(tmuxn.kill) {
    // TODO implement kill template
  }
} catch (e) {
  console.log(e);
}
