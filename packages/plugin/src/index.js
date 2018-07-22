'use strict'
require('@serverless-local-proxy/events_manager')
require('@serverless-local-proxy/px_dynamodb')
require('@serverless-local-proxy/px_functions')
require('@serverless-local-proxy/hotreload')
require('https')
const { Plugin: ServerlessLocalProxy } = require('./plugin')
module.exports = ServerlessLocalProxy
