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

    console.log(proxySettings);


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
