const { factory: httpFactory } = require('../middleware/http');
const { factory: httpRequestLoggerFactory } = require('../middleware/httprequestlogger');
const { factory: invokeFactory } = require('../middleware/invoke');

const middlewareList = [
    {
        name: 'httpInputLogger',
        factory: httpRequestLoggerFactory
    },
    {
        name: 'http',
        factory: httpFactory
    },
    {
        name: 'invoke',
        factory: invokeFactory
    },
];

module.exports = { middlewareList };
