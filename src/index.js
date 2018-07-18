'use strict';
require('./utils/hotreload');
require('./proxies/dynamodb');
require('./proxies/functions');
require('https');
const ServerlessLocalProxy = require('./plugin/ServerlessLocalProxy');
module.exports = ServerlessLocalProxy;
