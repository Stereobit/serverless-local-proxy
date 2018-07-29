const {factory: ddbMockApiFactory, MIDDLEWARE_NAME: ddbMockApiName} = require('@serverless-local-proxy/mw_ddb_mock_api')
const {factory: ddbQueryLoggerFactory, MIDDLEWARE_NAME: ddbQueryLoggerName} = require('@serverless-local-proxy/mw_ddb_query_logger')
const {factory: ddbTriggerFactory, MIDDLEWARE_NAME: ddbTriggerName} = require('@serverless-local-proxy/mw_ddb_trigger')
const {factory: proxyOutputFactory, MIDDLEWARE_NAME: proxyOutputName} = require('@serverless-local-proxy/mw_proxy_output')
const {factory: payloadToAwsEventFactory, MIDDLEWARE_NAME: payloadToAwsEventName} = require('@serverless-local-proxy/mw-payload-to-aws-event')
const {factory: invokeFunctionFactory, MIDDLEWARE_NAME: invokeFunctionName} = require('@serverless-local-proxy/mw_invoke_function')
const {factory: functionsToHttpFactory, MIDDLEWARE_NAME: functionsToHttpName} = require('@serverless-local-proxy/mw_functions_to_http')
const {factory: httpRequestLoggerFactory, MIDDLEWARE_NAME: httpRequestLoggerName} = require('@serverless-local-proxy/mw_http_request_logger')
const {factory: stateInjectFactory, MIDDLEWARE_NAME: stateInjectName} = require('@serverless-local-proxy/mw_state_inject')

const middlewareList = [
  {name: ddbMockApiName, factory: ddbMockApiFactory},
  {name: ddbQueryLoggerName, factory: ddbQueryLoggerFactory},
  {name: ddbTriggerName, factory: ddbTriggerFactory},
  {name: proxyOutputName, factory: proxyOutputFactory},
  {name: payloadToAwsEventName, factory: payloadToAwsEventFactory},
  {name: invokeFunctionName, factory: invokeFunctionFactory},
  {name: functionsToHttpName, factory: functionsToHttpFactory},
  {name: httpRequestLoggerName, factory: httpRequestLoggerFactory},
  {name: stateInjectName, factory: stateInjectFactory}
]

module.exports = {
  middlewareList,
  stateInjectFactory,
  proxyOutputFactory
}
