const MIDDLEWARE_NAME = 'invoke_function'
const LOG_PREFIX = 'InvokeFunction'
const {getMiddlewareOutputState, updateMiddlewareOutputState, middlewareFormattedOutput} = require('@serverless-local-proxy/utils_middleware')
const prettyJson = require('prettyjson')

/**
 * Factory
 *
 * @param config
 * @return {Function}
 */
const factory = (config) => {
  const {proxyLogPrefix} = config
  return async (ctx, next) => {
    const input = getMiddlewareOutputState(ctx)
    if (isValidInput(input)) {
      const invokeResult = await invokeFunction(
        input.invokeFunctionName,
        input.invokeFunctionPath,
        input.invokeFunctionPayload
      )
      const invokedFunctionResult = {
        invokedFunction: {
          functionName: input.invokeFunctionName,
          payload: input.invokeFunctionPayload,
          callback: {
            error: invokeResult.callbackError,
            result: invokeResult.callbackResult
          },
          exception: invokeResult.exception
        }
      }
      updateMiddlewareOutputState(ctx, invokedFunctionResult)
      logOutput(proxyLogPrefix, input, invokedFunctionResult)
    }

    await next()
  }
}

/**
 * LogOutput
 *
 * @param proxyLogPrefix
 * @param input
 * @param invokedFunctionResult
 */
const logOutput = (proxyLogPrefix, input, invokedFunctionResult) => {
  middlewareFormattedOutput(
    proxyLogPrefix,
    LOG_PREFIX,
    `Invoked function: ${input.invokeFunctionName}`,
    prettyJson.render(invokedFunctionResult, {
      keysColor: 'cyan',
      dashColor: 'magenta',
      stringColor: 'magenta'
    })
  )
}

/**
 * IsValidInput
 *
 * @param input
 */
const isValidInput = (input) => !(!input.invokeFunctionName || !input.invokeFunctionPath || !input.invokeFunctionPayload)

/**
 * InvokeFunction
 *
 * @param functionName
 * @param functionPath
 * @param requestPayload
 * @return {Promise<{any}>}
 */
const invokeFunction = async (functionName, functionPath, requestPayload) => {
  const handler = require(functionPath)[functionName]
  const invokeResult = {callbackError: null, callbackResult: null, exception: null}
  const ctx = {}
  try {
    const awsCallbackMock = (error, result) => (error)
      ? invokeResult.callbackError = error
      : invokeResult.callbackResult = result
    await handler(requestPayload, ctx, awsCallbackMock)
    return invokeResult
  } catch (e) {
    invokeResult.exception = e.message
    return invokeResult
  }
}

module.exports = {factory, MIDDLEWARE_NAME}
