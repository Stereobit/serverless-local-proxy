const {
  factory: mockApiFactory,
  MIDDLEWARE_NAME: mockApiName
} = require('@serverless-local-proxy/mw_ddb_mock_api')
const {
  factory: queryLoggerFactory,
  MIDDLEWARE_NAME: queryLoggerName
} = require('@serverless-local-proxy/mw_ddb_query_logger')
const {
  factory: ddbTriggerFactory,
  MIDDLEWARE_NAME: ddbTrigger
} = require('@serverless-local-proxy/mw_ddb_trigger')

const middlewareList = [
  {
    name: mockApiName,
    factory: mockApiFactory
  },
  {
    name: queryLoggerName,
    factory: queryLoggerFactory
  },
  {
    name: ddbTrigger,
    factory: ddbTriggerFactory
  }
]

module.exports = {middlewareList}
