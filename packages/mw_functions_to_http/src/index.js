const {ACTIONS} = require('./store/actions')
const {reducer} = require('./store/reducer')
const {getReduxDispatchFunction, logInfo} = require('@serverless-local-proxy/utils_middleware')
const {awsEventsFaker} = require('@serverless-local-proxy/aws_events_faker')
const MIDDLEWARE_NAME = 'functions_to_http'
const LOG_PREFIX = 'Http::'
const HTTP_METHODS = {GET: 'get', POST: 'post'}

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
        const payload = mutateRequestPayload(ctx, functionDetails.aws_event_type)
        const dispatch = getReduxDispatchFunction(ctx)
        dispatch(
          ACTIONS.INVOKED_FUNCTION_TRIGGER(
            functionDetails.name,
            payload,
            proxyName
          )
        )
        await next()
      }
    }
  })
}

/**
 * MutateRequestPayload
 *
 * @param ctx
 * @param aws_event_type
 * @return {*}
 */
const mutateRequestPayload = (ctx, aws_event_type) => {
  if (aws_event_type) {
    const payload = awsEventsFaker(aws_event_type, ctx.request.body)
    logInfo(ctx, LOG_PREFIX, `Request payload mutated to ${JSON.stringify(payload)}`)
    return payload
  }
  return ctx.request.body
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
