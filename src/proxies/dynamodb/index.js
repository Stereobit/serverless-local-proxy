const Koa = require('koa');
const Router = require('koa-router');
const KoaProxy = require('koa-proxy');
const body = require('koa-json-body');
const convert = require('koa-convert');
const EventsManager = require('../../events/Manager');
const { middlewareList } = require('./config/middlewarelist');
const { middlewareFactoryGateway } = require('../factorygateway');
const { factory: stateInitMiddleware } = require('../../shared/middleware/state/stateinit');
const { factory: stateInjectEventsManagerMiddleware } = require('../../shared/middleware/state/injecteventmanager');
const { factory: stateInjectProxyLoggerPrefixMiddleware } = require('../../shared/middleware/state/injectproxyloggerprefix');

const LOG_PREFIX = 'DynamoDBProxy::';
EventsManager.bind(EventsManager.eventsList.PROXY_START_DDB, (config) => DynamoDBProxy(config));

/**
 * DynamoDBTriggersProxy
 *
 * @return {null}
 * @constructor
 * @param proxySettings
 */
const DynamoDBProxy = (proxySettings) => {

    validateProxyConfig(proxySettings);

    const { proxy_host, proxy_port, dynamo_db_host } = proxySettings.config;

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
        koaServer.use(convert(body({ limit: '10kb', fallback: true })));
        koaServer.use(stateInitMiddleware({ diego: "ciao" }));
        koaServer.use(stateInjectEventsManagerMiddleware());
        koaServer.use(stateInjectProxyLoggerPrefixMiddleware(LOG_PREFIX));

        const serverMiddleware = middlewareCollection.filter(middleware => middleware.factoryType === 'SERVER');
        serverMiddleware.map(middleware => koaServer.use(middleware.resolver));

        const routerMiddleware = middlewareCollection.filter(middleware => middleware.factoryType === 'ROUTER');
        routerMiddleware.map(middleware => koaRouter[middleware.method](middleware.route, middleware.resolver));

        koaServer.use(koaRouter.routes());
        koaServer.use(koaRouter.allowedMethods());
        koaServer.use(convert(KoaProxy({ host: dynamo_db_host }))).listen(proxy_port);

        EventsManager.emitLogInfo(`${LOG_PREFIX} proxy started at ${proxy_host}:${proxy_port}`);

    } catch (e) {
        EventsManager.emitLogError(`${LOG_PREFIX} ${e.message}`);
    }

};

/**
 *
 * @param config
 * @return {*}
 */
const validateProxyConfig = (config) => {
    //TODO: Validate config
    return config;
};


module.exports = { DynamoDBProxy };
//
