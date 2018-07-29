/* eslint-disable camelcase */
const EventsManager = require('@serverless-local-proxy/events_manager')
const {KoaServer, koaBody, koaConvert, koaCompose, koaProxy} = require('./initkoa')
const {middlewareFactoryGateway} = require('@serverless-local-proxy/utils_middleware')
const {middlewareList, stateInjectFactory: stateInject} = require('@serverless-local-proxy/middleware_list')

const LOG_PREFIX = 'DynamoDBProxy::'

EventsManager.bind(EventsManager.eventsList.PROXY_START_DDB, config => dynamoDbProxy(config))

/**
 * DynamoDbProxy
 *
 * @return {null}
 * @constructor
 * @param proxySettings
 */
const dynamoDbProxy = (proxySettings) => {
  isProxySettingValid(proxySettings)
  const {proxy_host, proxy_port, dynamo_db_host} = proxySettings.config

  try {
    const koaServer = new KoaServer()
    const middlewareCollection = middlewareFactoryGateway({
      middlewareList: middlewareList,
      proxyConfig: proxySettings.config,
      serviceFunctions: proxySettings.serviceFunctions,
      proxyLogPrefix: LOG_PREFIX
    })
    koaServer.use(koaConvert(koaBody({limit: '10kb', fallback: true})))
    koaServer.use(stateInject('input', {}))
    koaServer.use(stateInject('output', {}))
    koaServer.use(koaCompose(middlewareCollection))
    koaServer.use(koaProxy(dynamo_db_host))
    koaServer.listen(proxy_port)
    EventsManager.emitLogInfo(`${LOG_PREFIX} proxy started at ${proxy_host}:${proxy_port}`)
  } catch (e) {
    EventsManager.emitLogError(`${LOG_PREFIX} ${e.message}`)
  }
}

/**
 * IsProxySettingValid
 *
 * @param config
 * @return {*}
 */
const isProxySettingValid = (config) => {
  // TODO: Validate config
  return config
}

module.exports = {dynamoDbProxy}
