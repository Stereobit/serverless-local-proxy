'use strict';
require('./utils/hotreload');
require('./proxies/dynamodb/index');
require('./proxies/functions/index');
require('https');
const ServerlessLocalProxy = require('./plugin/ServerlessLocalProxy');
module.exports = ServerlessLocalProxy;
