#!/usr/bin/env node

const kexec = require('@jcoreio/kexec');
const shell = require('shelljs');
const utils = require('./lib/utils');
const ScriptBuilder = require('./lib/script_builder').ScriptBuilder;
const KillScriptBuilder = require('./lib/kill_script_builder').KillScriptBuilder;

let tmuxn = require('commander');
tmuxn
  .version('0.0.2')
  .usage('[--create/--start/--kill/--debug] <project_name>', '[--project] <project_config>', '[--root] <project_root>')
  .option('-c, --create <project_name>', 'Create new project with name')
  .option('-s, --start <project_name>', 'Start project with name')
  .option('-k, --kill <project_name>', 'Kill project with name')
  .option('-d, --debug <project_name>', 'Print shell commands of project with name')
  .option('-p, --project <project_config>', 'Provide project config file')
  .option('-r, --root <project_root>', 'root=$PD as a command line argument WITHOUT dashes')
  .option('-v, --server <project_server>', 'dev|stage|prod This is used to set the MTI_ENV variable required by Drush')
  .option('-w, --web <project_web>', 'dev-web|stage-web1|prod-web1')
  .option('-p, --pal <project_pal>', 'dev-pal|stage-pal1|prod-pal1')
  .parse(process.argv);

function _checkLoadedData (loadedData) {
  if (!loadedData.name || !loadedData.windows) {
    shell.echo('The config file contains errors: no name or no windows set.');
    shell.exit(1);
  }
}

function _loadCheckData (name) {
  utils.checkHealth();
  let loadedData = utils.parseYamlByName(name);
  _checkLoadedData(loadedData);
  return loadedData;
}

function _loadCheckDataByFileName (filename, root = undefined, server = undefined, web = undefined, pal = undefined) {
  utils.checkHealth();
  let loadedData = utils.parseYamlByFileName(filename, root, server, web, pal);
  _checkLoadedData(loadedData);
  return loadedData;
}

if (!tmuxn.create && !tmuxn.start && !tmuxn.kill && !tmuxn.debug) {
  console.log('Display possible commands with tmuxn --help');
  console.log('No option given, aborting...');
  process.exit(0);
}

try {
  if (tmuxn.start) {
    let loadedData;
    let project;
    let root;
    let server;
    let web;
    let pal;

    if (typeof tmuxn.project !== 'undefined' && tmuxn.project && utils.checkFile(tmuxn.project)) {
      project = tmuxn.project;
      if (typeof tmuxn.root !== 'undefined' && tmuxn.root && utils.checkFile(tmuxn.root)) {
        root = tmuxn.root;
      }
      if (typeof tmuxn.server !== 'undefined' && tmuxn.server) {
        server = tmuxn.server;
      }
      if (typeof tmuxn.web !== 'undefined' && tmuxn.web) {
        web = tmuxn.web;
      }
      if (typeof tmuxn.pal !== 'undefined' && tmuxn.pal) {
        pal = tmuxn.pal;
      }
      loadedData = _loadCheckDataByFileName(project, root, server, web, pal);
    } else {
      loadedData = _loadCheckData(tmuxn.start);
    }
    let execString = new ScriptBuilder(loadedData).buildScript();
    kexec(execString);
  }
  if (tmuxn.create) {
    utils.checkHealth();
    utils.createNewProjectWithName(tmuxn.create);
  }
  if (tmuxn.kill) {
    let loadedData = _loadCheckData(tmuxn.kill);
    let execString = new KillScriptBuilder(loadedData).buildScript();
    kexec(execString);
  }
  if (tmuxn.debug) {
    let loadedData = _loadCheckData(tmuxn.debug);
    let execString = new ScriptBuilder(loadedData).buildScript();
    console.log(execString);
  }
} catch (e) {
  console.log(e);
}
