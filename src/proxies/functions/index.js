const Koa = require('koa');
const Router = require('koa-router');
const body = require('koa-json-body');
const index = require('koa-proxy');
const convert = require('koa-convert');

const EventsManager = require('../../events/Manager');

EventsManager.bind(EventsManager.eventsList.PROXY_START_FUNCTIONS_TO_HTTP, (config) => FunctionToHttpProxy(config));

/**
 *
 * @param config
 * @constructor
 */
const FunctionToHttpProxy = (proxySettings) => {
    const { OUTPUT_LOG_INFO, OUTPUT_LOG_WARNING, OUTPUT_LOG_ERROR } = EventsManager.eventsList;
    const { isActive, proxy_host, proxy_port } = proxySettings.config;

    if (isActive === false)
        return false;

    try {
        const server = new Koa();
        const router = new Router();
        
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
