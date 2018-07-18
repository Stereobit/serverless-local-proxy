const koa = require('koa');
const body = require('koa-json-body');
const index = require('koa-proxy');
const convert = require('koa-convert');
const { terraformSupport } = require('./middlewares/terraform_support');
const { dynamoDbTriggers } = require('./middlewares/dynamo_triggers');
const EventsManager = require('../../events/Manager');

EventsManager.bind(EventsManager.eventsList.PROXY_START_DDB, (config) => DynamoDBTriggersProxy(config));

const MIDDLEWARES_LIST = [
    {
        label: 'terraformSupport',
        resolver: terraformSupport

    },
    {

        label: 'dynamoDbTriggers',
        resolver: dynamoDbTriggers
    }
];

const DynamoDBTriggersProxy = (proxyConfig) => {
    const { OUTPUT_LOG_INFO, OUTPUT_LOG_WARNING, OUTPUT_LOG_ERROR } = EventsManager.eventsList;
    try {
        const { isActive, proxy_host, proxy_port, dynamo_db_host, middlewares } = proxyConfig;
        if (isActive === false)
            return null;

        const app = new koa();
        app.use(convert(body({ limit: '10kb', fallback: true })));
        middlewares.forEach(requestedMiddleware => {
            const middleware = MIDDLEWARES_LIST.find(middleware => middleware.label === requestedMiddleware);
            (middleware)
                ? app.use(middleware.resolver)
                : EventsManager.emit(OUTPUT_LOG_WARNING, `No middleware found with name ${requestedMiddleware} `);
        });
        app.use(convert(index({ host: dynamo_db_host }))).listen(proxy_port);
        EventsManager.emit(OUTPUT_LOG_INFO, `Started DynamoDBTriggers proxy at ${proxy_host}:${proxy_port}`);
    } catch (e) {
        EventsManager.emit(OUTPUT_LOG_ERROR, `DynamoDBTriggers: ${e.message}`);
    }
};

module.exports = { DynamoDBTriggersProxy };
