const EventsManager = require('@serverless-local-proxy/events_manager')
const Koa = require('koa')
const Router = require('koa-router')
const KoaProxy = require('koa-proxy')
const body = require('koa-json-body')
const convert = require('koa-convert')
const {middlewareList} = require('./config/middlewarelist')
const {middlewareFactoryGateway} = require('@serverless-local-proxy/utils_middleware')
const {factory: stateInject} = require('@serverless-local-proxy/mw_state_inject')

const LOG_PREFIX = 'DynamoDBProxy::'

EventsManager.bind(EventsManager.eventsList.PROXY_START_DDB, (config) => dynamoDbProxy(config))

/**
 * DynamoDBTriggersProxy
 *
 * @return {null}
 * @constructor
 * @param proxySettings
 */
const dynamoDbProxy = (proxySettings) => {

  validateProxyConfig(proxySettings)
  const {store} = proxySettings
  const {proxy_host, proxy_port, dynamo_db_host} = proxySettings.config

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

    koaServer.use(convert(body({limit: '10kb', fallback: true})))
    koaServer.use(stateInject('eventsManager', EventsManager))
    koaServer.use(stateInject('proxyLoggerPrefix', LOG_PREFIX))
    koaServer.use(stateInject('store', store))

    middlewareCollection.map(middleware => (middleware.factoryType === 'SERVER')
      ? koaServer.use(middleware.resolver)
      : koaRouter[middleware.method](middleware.route, middleware.resolver))

    koaServer.use(koaRouter.routes())
    koaServer.use(koaRouter.allowedMethods())
    koaServer.use(convert(KoaProxy({host: dynamo_db_host}))).listen(proxy_port)

    EventsManager.emitLogInfo(`${LOG_PREFIX} proxy started at ${proxy_host}:${proxy_port}`)
  } catch (e) {
    EventsManager.emitLogError(`${LOG_PREFIX} ${e.message}`)
  }
}

/**
 *
 * @param config
 * @return {*}
 */
const validateProxyConfig = (config) => {
  // TODO: Validate config
  return config
}

module.exports = {dynamoDbProxy}
