const Koa = require('koa');
const Router = require('koa-router');
const { middlewareList } = require('./config/middlewarelist');
const { middlewareFactoryGateway } = require('../factorygateway');
const { factory: stateInitMiddleware } = require('../../shared/middleware/state/stateinit');
const { factory: stateInjectEventsManagerMiddleware } = require('../../shared/middleware/state/injecteventmanager');
const { factory: stateInjectProxyLoggerPrefixMiddleware } = require('../../shared/middleware/state/injectproxyloggerprefix');

const EventsManager = require('../../events/Manager');
const LOG_PREFIX = 'FunctionsProxy::';

EventsManager.bind(EventsManager.eventsList.PROXY_START_FUNCTIONS, (config) => functionsProxy(config));

/**
 * FunctionsProxy
 *
 * @constructor
 * @param proxySettings
 */
const functionsProxy = async (proxySettings) => {

    validateProxyConfig(proxySettings);

    const { proxy_host, proxy_port } = proxySettings.config;

    try {
        const koaServer = new Koa();
        const koaRouter = new Router();

        const middlewareCollection = middlewareFactoryGateway({
            middlewareList: middlewareList,
            proxyConfig: proxySettings.config,
            serviceFunctions: proxySettings.serviceFunctions,
            eventsManager: EventsManager,
            proxyLogPrefix: LOG_PREFIX
        });

        koaServer.use(stateInitMiddleware({ diego: "ciao" }));
        koaServer.use(stateInjectEventsManagerMiddleware());
        koaServer.use(stateInjectProxyLoggerPrefixMiddleware(LOG_PREFIX));

        const serverMiddleware = middlewareCollection.filter(middleware => middleware.factoryType === 'SERVER');
        serverMiddleware.map(middleware => koaServer.use(middleware.resolver));

        const routerMiddleware = middlewareCollection.filter(middleware => middleware.factoryType === 'ROUTER');
        routerMiddleware.map(middleware => koaRouter[middleware.method](middleware.route, middleware.resolver));

        koaServer.use(koaRouter.routes());
        koaServer.use(koaRouter.allowedMethods());
        koaServer.listen(proxy_port);

        EventsManager.emitLogInfo(`${LOG_PREFIX} proxy started at ${proxy_host}:${proxy_port}`);

    } catch (e) {
        EventsManager.emitLogError(`${LOG_PREFIX} ${e.message}`);
    }

};

const validateProxyConfig = () => {

};

module.exports = { functionsProxy };
