const MIDDLEWARE_NAME = 'functions_to_http'
const LOG_PREFIX = 'Http::'
const HTTP_METHODS = {GET: 'get', POST: 'post'}
const {ACTIONS} = require('./store/actions')
const {reducer} = require('./store/reducer')

/**
 * Factory
 *
 * @param config
 * @return {{factoryType: string, method: string, route: string, resolver: resolver}}
 */
const factory = (config) => {
  // Extract global middleware config
  const {name: proxyName} = config.proxyConfig
  const {name: middlewareName, default_http_method} = config.middlewareConfig
  return config.serviceFunctions.map(functionDetails => {
    // Extract middleware config from function
    const {method: methodFromFunction} = functionDetails[middlewareName] || {}
    const method = resolveHttpMethod(default_http_method, methodFromFunction)
    logEndpointCreated(config, method, functionDetails.name)
    return {
      middlewareName,
      factoryType: 'ROUTER',
      method: method.toLowerCase(),
      route: `/${functionDetails.name}`,
      resolver: async (ctx, next) => {
        const dispatch = ctx.state.get('store').get('dispatch')
        dispatch(ACTIONS.INVOKED_FUNCTION_TRIGGER(functionDetails.name, proxyName))
        await next()
      }
    }
  })
}

/**
 * RevolveHttpMethod
 *
 * @param globalConfig
 * @param functionConfig
 * @param defaultHttpMethod
 * @return {*}
 */
const resolveHttpMethod = (globalConfig, functionConfig, defaultHttpMethod = HTTP_METHODS.POST) => {
  if (functionConfig) {
    return functionConfig
  }
  return (globalConfig) || defaultHttpMethod
}

/**
 * LogEndpointCreated
 *
 * @param config
 * @param httpMethod
 * @param functionName
 */
const logEndpointCreated = (config, httpMethod, functionName) => {
  const {proxy_host, proxy_port} = config.proxyConfig
  const {eventsManager, proxyLogPrefix} = config
  const {OUTPUT_LOG_INFO} = eventsManager.eventsList
  eventsManager.emit(
    OUTPUT_LOG_INFO,
    `${proxyLogPrefix}${LOG_PREFIX} Created endpoint [${httpMethod}] ${proxy_host}:${proxy_port}/${functionName}`
  )
}

module.exports = {
  factory,
  MIDDLEWARE_NAME,
  storeSettings: {
    reducer,
    actions: ACTIONS,
    storeKey: MIDDLEWARE_NAME
  }
}
