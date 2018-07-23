const MIDDLEWARE_NAME = 'invoke_function'
const LOG_PREFIX = 'InvokeFunction::'

// TODO: @diego[feature] this must be taken from the middleware yml config
const WATCH_STORE_SECTION = 'functions_to_http'
const {subscribeToStoreChanges} = require('@serverless-local-proxy/utils_middleware')

/**
 * Factory
 *
 * @param config
 * @return {{middlewareName: *, factoryType: string, resolver: resolver}}
 */
const factory = (config) => {
  const {name: proxyName} = config.proxyConfig
  const {name: middlewareName} = config.middlewareConfig
  return {
    middlewareName,
    factoryType: 'REDUX',
    resolver: async (ctx, next) => {
      subscribeToStoreChanges(ctx, WATCH_STORE_SECTION, (newValue) => {
        if (newValue.proxyName === proxyName) {
          console.log('state changed')
        }
      })
      await next()
    }
  }
}

module.exports = {factory, MIDDLEWARE_NAME}
