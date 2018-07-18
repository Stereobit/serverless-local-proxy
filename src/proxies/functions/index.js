const Koa = require('koa');
const Router = require('koa-router');
const { invoke } = require('./middlewares/invoke');

const EventsManager = require('../../events/Manager');
const LOG_PREFIX = 'FunctionsProxy::';

EventsManager.bind(EventsManager.eventsList.PROXY_START_FUNCTIONS_TO_HTTP, (config) => functionsToHttpProxy(config));

/**
 * FunctionToHttpProxy
 *
 * @constructor
 * @param proxySettings
 */
const functionsToHttpProxy = (proxySettings) => {
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
            EventsManager.emit(OUTPUT_LOG_INFO, `${LOG_PREFIX} Created endpoint ${proxy_host}:${proxy_port}/${functionDetails.name}`);
        });

        server
            .use(router.routes())
            .use(router.allowedMethods())
            .listen(proxy_port);

        EventsManager.emit(OUTPUT_LOG_INFO, `${LOG_PREFIX} proxy started at ${proxy_host}:${proxy_port}`);
    } catch (e) {
        EventsManager.emit(OUTPUT_LOG_ERROR, `${LOG_PREFIX}   ${e.message}`);
    }

};

module.exports = { functionsToHttpProxy };
