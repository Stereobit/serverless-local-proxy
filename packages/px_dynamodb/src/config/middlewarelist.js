const { factory: mockApiFactory, MIDDLEWARE_NAME: mockApiName } = require('@serverless-local-proxy/ddb_mock_api');
const { factory: queryLoggerFactory, MIDDLEWARE_NAME: queryLoggerName } = require('@serverless-local-proxy/ddb_query_logger');

const middlewareList = [
    {
        name: mockApiName,
        factory: mockApiFactory
    },
    {
        name: queryLoggerName,
        factory: queryLoggerFactory
    },
];

module.exports = { middlewareList };
