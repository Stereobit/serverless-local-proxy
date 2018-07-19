const { factory: httpFactory } = require('../middleware/http');
const { factory: httpRequestLoggerFactory } = require('../middleware/httprequestlogger');

const middlewareList = [
    {
        name: 'httpInputLogger',
        factory: httpRequestLoggerFactory
    },
    {
        name: 'http',
        factory: httpFactory
    },
];

module.exports = { middlewareList };
