const Koa = require('koa');
const Router = require('koa-router');
// const body = require('koa-json-body');
// const index = require('koa-proxy');
// const convert = require('koa-convert');
const { invoke } = require('./middlewares/invoke');

const EventsManager = require('../../events/Manager');

EventsManager.bind(EventsManager.eventsList.PROXY_START_FUNCTIONS_TO_HTTP, (config) => FunctionToHttpProxy(config));

/**
 * FunctionToHttpProxy
 *
 * @constructor
 * @param proxySettings
 */
const FunctionToHttpProxy = (proxySettings) => {
    const { OUTPUT_LOG_INFO, OUTPUT_LOG_WARNING, OUTPUT_LOG_ERROR } = EventsManager.eventsList;
    const { isActive, proxy_host, proxy_port } = proxySettings.config;
    if (isActive === false)
        return false;

    try {
        const server = new Koa();
        const router = new Router();


        Array.from(proxySettings.functions.values()).map(functionDetails => {
            router.get(`/${functionDetails.name}`, (ctx, next) =>
                invoke(ctx, next, functionDetails.name, functionDetails.path));
            EventsManager.emit(OUTPUT_LOG_INFO, `Created endpoint ${proxy_host}:${proxy_port}/${functionDetails.name}`);
        });

        server
            .use(router.routes())
            .use(router.allowedMethods())
            .listen(proxy_port);

        EventsManager.emit(OUTPUT_LOG_INFO, `Started FunctionToHttpProxy proxy at ${proxy_host}:${proxy_port}`);
    } catch (e) {
        EventsManager.emit(OUTPUT_LOG_ERROR, `FunctionToHttpProxy error  ${e.message}`);
    }

};

module.exports = { FunctionToHttpProxy };


const d =
    [
        ['analyticsEvents',
            {
                name: 'analyticsEvents',
                path: '/Users/danniballo/development/code/backend/src/handlers/indexers/analytics/index',
                config: [Object]
            }],
        ['logsMonitor',
            {
                name: 'logsMonitor',
                path: '/Users/danniballo/development/code/backend/src/handlers/monitors/logs/index',
                config: [Object]
            }]]
