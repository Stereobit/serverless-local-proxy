const {
  factory: httpFactory,
  MIDDLEWARE_NAME: httpName
} = require('@serverless-local-proxy/mw_functions_to_http')
const {
  factory: httpRequestLoggerFactory,
  MIDDLEWARE_NAME: httpLoggerName
} = require('@serverless-local-proxy/mw_http_request_logger')

const middlewareList = [
  {
    name: httpLoggerName,
    factory: httpRequestLoggerFactory
  },
  {
    name: httpName,
    factory: httpFactory
  }
]

module.exports = { middlewareList }
