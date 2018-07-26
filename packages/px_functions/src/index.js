const EventsManager = require('@serverless-local-proxy/events_manager')
const Koa = require('koa')
const Router = require('koa-router')
const compose = require('koa-compose')
const body = require('koa-json-body')
const convert = require('koa-convert')
const {middlewareList} = require('./config/middlewarelist')
const {middlewareFactoryGateway} = require('@serverless-local-proxy/utils_middleware')
const {factory: stateInject} = require('@serverless-local-proxy/mw_state_inject')
const PROXY_NAME = 'functionsProxy'
const LOG_PREFIX = `${PROXY_NAME}::`
const {ACTIONS} = require('./redux/actions/actions')
const {reducer} = require('./redux/reducers/reducer')

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
      proxyConfig: {...proxySettings.config, name: PROXY_NAME},
      serviceFunctions: proxySettings.serviceFunctions,
      eventsManager: EventsManager,
      proxyLogPrefix: LOG_PREFIX,
    })

    store.dispatch(ACTIONS.LIST_SERVICE_FUNCTIONS_TRIGGER(proxySettings.serviceFunctions))

    // Init redux middleware, who doesn't follow the koa server flow then requires to have a different ctx
    const reduxMiddlewareCollection = middlewareCollection
      .filter(middleware => middleware.factoryType === 'REDUX')
      .map(middleware => middleware.resolver)

    compose([stateInject('store', store), ...reduxMiddlewareCollection])({state: {}})

    // Init Koa flow
    const koaMiddlewareCollection = middlewareCollection
      .filter(middleware => middleware.factoryType === 'SERVER' || middleware.factoryType === 'ROUTER')
    koaServer.use(convert(body({fallback: true})))
    koaServer.use(stateInject('eventsManager', EventsManager))
    koaServer.use(stateInject('proxyLoggerPrefix', LOG_PREFIX))
    koaServer.use(stateInject('store', store))
    koaMiddlewareCollection.map(middleware => (middleware.factoryType === 'SERVER')
      ? koaServer.use(middleware.resolver)
      : koaRouter[middleware.method](middleware.route, middleware.resolver))

    koaServer.use(koaRouter.routes())
    koaServer.use(koaRouter.allowedMethods())
    koaServer.use(async (ctx, next) => {
      ctx.response.status = 200
      await next()
    })
    koaServer.listen(proxy_port)

    EventsManager.emitLogInfo(`${LOG_PREFIX} proxy started at ${proxy_host}:${proxy_port}`)
  } catch (e) {
    EventsManager.emitLogError(`${LOG_PREFIX} ${e.message}`)
  }
}

const validateProxyConfig = () => {

}

module.exports = {
  functionsProxy,
  storeSettings: {
    reducer,
    actions: ACTIONS,
    storeKey: PROXY_NAME
  }
}
