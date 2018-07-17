#!/usr/bin/env node
const packageInfo = require('../package');
const program = require('commander');
const path = require('path');
const startCommand = require('./commands/start');

require('./output/decorators/console/welcome');

// App global settings
global.appRoot = path.resolve(__dirname);
global.tmpFolder = 'tmp';

program
    .version(packageInfo.version, '-v --version')
    .description(`${packageInfo.description}`);

program
    .command('start <yml_config_path>')
    .action(dir => startCommand(dir).catch(error => console.error(error)));

program.parse(process.argv);