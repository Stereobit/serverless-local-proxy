const MIDDLEWARE_NAME = 'invoke_function'
const LOG_PREFIX = 'InvokeFunction::'

// TODO: @diego[feature] this must be taken from the middleware yml config
const WATCH_STORE_SECTION = 'functions_to_http'
const {subscribeToStoreChanges, getReduxState} = require('@serverless-local-proxy/utils_middleware')

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
      subscribeToStoreChanges(ctx, WATCH_STORE_SECTION, async (newStoreValue) => {
        // If the middleware was invoked from a different proxy, we can skip it...
        if (newStoreValue.proxyName !== proxyName) {
          return null
        }
        const reduxState = getReduxState(ctx)
        const functionDetails = reduxState.functionsProxy.functionsSettings
          .find(functionDetails => functionDetails.name === newStoreValue.functionName)

        if (functionDetails) {
          await invokeFunction(functionDetails.name, functionDetails.path)
        }

      })
      await next()
    }
  }
}

const invokeFunction = async (functionName, functionPath) => {

  const handler = require(functionPath)[functionName]
  try {
    const callbackMock = (error, result) => {
      console.log("INVOKE: ERROR IN CALLBACK")
      console.log(error);
      console.log("INVOKE: RESULT IN CALLBACK")
      console.log(result);
    }
    const ctx = {}
    await handler({}, ctx, callbackMock)
  } catch (e) {
    console.log('INVOKE: EXCEPTION')
    console.log(e)
  }
}

module.exports = {factory, MIDDLEWARE_NAME}
