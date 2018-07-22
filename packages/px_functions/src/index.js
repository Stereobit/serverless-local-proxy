const EventsManager = require('@serverless-local-proxy/events_manager')
const Koa = require('koa')
const Router = require('koa-router')
const {middlewareList} = require('./config/middlewarelist')
const {middlewareFactoryGateway} = require('@serverless-local-proxy/utils_middleware')
const {factory: stateInject} = require('@serverless-local-proxy/mw_state_inject')
const LOG_PREFIX = 'FunctionsProxy::'

EventsManager.bind(EventsManager.eventsList.PROXY_START_FUNCTIONS, (config) => functionsProxy(config))

/**
 * FunctionsProxy
 *
 * @constructor
 * @param proxySettings
 */
const functionsProxy = (proxySettings) => {
  validateProxyConfig(proxySettings)

  const {store} = proxySettings
  const {proxy_host, proxy_port} = proxySettings.config

  try {
    const koaServer = new Koa()
    const koaRouter = new Router()

    const middlewareCollection = middlewareFactoryGateway({
      middlewareList: middlewareList,
      proxyConfig: proxySettings.config,
      serviceFunctions: proxySettings.serviceFunctions,
      eventsManager: EventsManager,
      proxyLogPrefix: LOG_PREFIX
    })

    koaServer.use(stateInject('eventsManager', EventsManager))
    koaServer.use(stateInject('proxyLoggerPrefix', LOG_PREFIX))
    koaServer.use(stateInject('store', store))

    middlewareCollection.map(middleware => (middleware.factoryType === 'SERVER')
      ? koaServer.use(middleware.resolver)
      : koaRouter[middleware.method](middleware.route, middleware.resolver))

    koaServer.use(koaRouter.routes())
    koaServer.use(koaRouter.allowedMethods())
    koaServer.listen(proxy_port)

    EventsManager.emitLogInfo(`${LOG_PREFIX} proxy started at ${proxy_host}:${proxy_port}`)
  } catch (e) {
    EventsManager.emitLogError(`${LOG_PREFIX} ${e.message}`)
  }
}

const validateProxyConfig = () => {

}

module.exports = {functionsProxy}
