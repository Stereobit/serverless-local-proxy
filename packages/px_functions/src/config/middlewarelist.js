const {
  factory: httpFactory,
  MIDDLEWARE_NAME: httpName
} = require('@serverless-local-proxy/mw_functions_to_http')
const {
  factory: httpRequestLoggerFactory,
  MIDDLEWARE_NAME: httpLoggerName
} = require('@serverless-local-proxy/mw_http_request_logger')
const {
  factory: invokeFunctionFactory,
  MIDDLEWARE_NAME: invokeFunctionName
} = require('@serverless-local-proxy/mw_invoke_function')

const middlewareList = [
  {
    name: httpLoggerName,
    factory: httpRequestLoggerFactory
  },
  {
    name: httpName,
    factory: httpFactory
  },
  {
    name: invokeFunctionName,
    factory: invokeFunctionFactory
  }
]

module.exports = {middlewareList}
