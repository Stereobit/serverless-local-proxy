'use strict';
require('@serverless-local-proxy/events_manager');
require('@serverless-local-proxy/px_dynamodb');
require('@serverless-local-proxy/px_functions');
require('./utils/hotreload');
require('https');
const ServerlessLocalProxy = require('./plugin/ServerlessLocalProxy');
module.exports = ServerlessLocalProxy;
