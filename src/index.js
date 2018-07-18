'use strict';
require('./proxies/dynamodb');
require('./proxies/functions');
const ServerlessProxy = require('./plugin/ServerlessProxy');


module.exports = ServerlessProxy;
