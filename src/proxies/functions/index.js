const Koa = require('koa');
const Router = require('koa-router');
const { middlewareList } = require('./config/middlewarelist');
const { middlewareFactoryGateway } = require('../factorygateway');
const { factory: stateInjectStoreMiddleware } = require('../../shared/middleware/state/injectstore');
const { factory: stateInjectEventsManagerMiddleware } = require('../../shared/middleware/state/injecteventmanager');
const { factory: stateInjectProxyLoggerPrefixMiddleware } = require('../../shared/middleware/state/injectproxyloggerprefix');
const { factory: storeInjectServiceFunctionsMiddleware } = require('../../shared/middleware/store/injectservicefunctions');

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

        koaServer.use(stateInjectStoreMiddleware());
        koaServer.use(stateInjectEventsManagerMiddleware());
        koaServer.use(stateInjectProxyLoggerPrefixMiddleware(LOG_PREFIX));
        koaServer.use(storeInjectServiceFunctionsMiddleware(proxySettings.serviceFunctions));

        middlewareCollection.map(middleware => (middleware.factoryType === 'SERVER')
            ? koaServer.use(middleware.resolver)
            : koaRouter[middleware.method](middleware.route, middleware.resolver));

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
