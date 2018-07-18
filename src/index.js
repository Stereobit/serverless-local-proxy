'use strict';
require('./utils/hotreload');
require('./proxies/dynamodb');
require('./proxies/functions');
require('https');
const ServerlessProxy = require('./plugin/ServerlessProxy');
module.exports = ServerlessProxy;
