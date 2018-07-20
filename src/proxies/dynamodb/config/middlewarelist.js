const { factory: triggersFactory } = require('../middleware/triggers');
const { factory: mockApiFactory } = require('../middleware/mockapi');
const { factory: crudTestFactory } = require('../middleware/crudtest');
const { factory: queryLoggerFactory } = require('../middleware/queryloggeer');

const middlewareList = [
    {
        name: 'triggers',
        factory: triggersFactory
    },
    {
        name: 'mockapi',
        factory: mockApiFactory
    },
    {
        name: 'crudtest',
        factory: crudTestFactory
    },
    {
        name: 'querylogger',
        factory: queryLoggerFactory
    },
];

module.exports = { middlewareList };
