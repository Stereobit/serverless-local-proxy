const MIDDLEWARE_NAME = 'functions_to_http'
const LOG_PREFIX = 'FunctionToHttp'
const {updateMiddlewareOutputState, logInfo} = require('@serverless-local-proxy/utils_middleware')

/**
 * Factory
 *
 * @param config
 * @return {Function}
 */
const factory = (config) => {
  const {proxyLogPrefix} = config
  const {proxy_host, proxy_port} = config.proxyConfig
  config.serviceFunctions.map(functionDetails => {
    logInfo(proxyLogPrefix, LOG_PREFIX, `Listening at: ${proxy_host}:${proxy_port}/${functionDetails.name}`)
  })
  return async (ctx, next) => {
    const functionDetails = getFunctionDetails(config, ctx)
    if (functionDetails) {
      updateMiddlewareOutputState(ctx, {
          invokeFunctionName: functionDetails.name,
          invokeFunctionPath: functionDetails.path,
          invokeFunctionPayload: ctx.request.body,
        }
      )
    }
    await next()
  }
}

/**
 * GetFunctionDetails
 *
 * @return {boolean}
 * @param {{}} config
 * @param {{}} ctx
 */
const getFunctionDetails = (config, ctx) => {
  // Check request method
  const middlewareConfig = config.middlewareConfig.default_http_method
  if (!middlewareConfig || middlewareConfig.toUpperCase() !== ctx.request.method) {
    return false
  }

  // Check if the service has functions...just in case...
  if (config.serviceFunctions instanceof Array === false || config.serviceFunctions.length <= 0) {
    return false
  }

  // Check if function exist in the service
  const functionRequested = String(ctx.request.url).replace('/', '').toLowerCase()
  const spottedFunction = config.serviceFunctions
    .find(functionDetails => String(functionDetails.name).toLowerCase() === functionRequested)

  return spottedFunction
    ? spottedFunction
    : false
}

module.exports = {factory, MIDDLEWARE_NAME}
