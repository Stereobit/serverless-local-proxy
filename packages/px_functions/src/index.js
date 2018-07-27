const {KoaServer, koaCompose, koaBody, koaConvert} = require('./initkoa')
const EventsManager = require('@serverless-local-proxy/events_manager')
const {middlewareFactoryGateway} = require('@serverless-local-proxy/utils_middleware')
const {middlewareList, stateInjectFactory: stateInject, proxyOutputFactory: proxyOutput} = require('@serverless-local-proxy/middleware_list')

const PROXY_NAME = 'FunctionsProxy'
const LOG_PREFIX = `${PROXY_NAME}::`

EventsManager.bind(EventsManager.eventsList.PROXY_START_FUNCTIONS, settings => functionsProxy(settings))

/**
 * FunctionsProxy
 *
 * @constructor
 * @param proxySettings
 */
const functionsProxy = (proxySettings) => {
  isProxySettingValid(proxySettings)
  const {proxy_host, proxy_port} = proxySettings.config
  try {
    const middlewareCollection = middlewareFactoryGateway({
      middlewareList: middlewareList,
      proxyConfig: {...proxySettings.config, name: PROXY_NAME},
      serviceFunctions: proxySettings.serviceFunctions,
      proxyLogPrefix: LOG_PREFIX
    })
    const koaServer = new KoaServer()
    koaServer.use(koaConvert(koaBody({fallback: true})))
    koaServer.use(stateInject('input', {}))
    koaServer.use(stateInject('output', {}))
    koaServer.use(koaCompose(middlewareCollection))
    koaServer.use(proxyOutput())
    koaServer.listen(proxy_port)

    EventsManager.emitLogInfo(`${LOG_PREFIX} proxy started at ${proxy_host}:${proxy_port}`)
  } catch (e) {
    EventsManager.emitLogError(`${LOG_PREFIX} ${e.message}`)
  }
}

/**
 * IsProxySettingValid
 *
 * TODO: @diego[feature] Validate proxy settings
 * @param {{}} proxySettings
 * @return {{}}
 */
const isProxySettingValid = (proxySettings) => proxySettings

module.exports = {functionsProxy}
