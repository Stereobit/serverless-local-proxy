const MIDDLEWARE_NAME = 'payload-to-aws-event'
const {getMiddlewareOutputState, updateMiddlewareOutputState} = require('@serverless-local-proxy/utils_middleware')
const {awsEventsFaker} = require('@serverless-local-proxy/aws_events_faker')

/**
 * Factory
 *
 * @param config
 * @return {Function}
 */
const factory = (config) => {
  return async (ctx, next) => {
    const input = getMiddlewareOutputState(ctx)
    const eventType = getEventType(config, input)
    if (isValidInput(input) && eventType) {
      const payload = awsEventsFaker(eventType, ctx.request.body)
      updateMiddlewareOutputState(ctx, {invokeFunctionPayload: payload})
    }
    await next()
  }
}

/**
 * GetEventType
 *
 * @param config
 * @param input
 */
const getEventType = (config, input) => {
  const spottedFunction = config.serviceFunctions
    .find(functionDetails => functionDetails.name === input.invokeFunctionName)
  return (spottedFunction && spottedFunction.aws_event_type) ? spottedFunction.aws_event_type : null
}

/**
 * IsValidInput
 *
 * @param input
 * @return {boolean}
 */
const isValidInput = (input) => {
  return !!input.invokeFunctionPayload && !!input.invokeFunctionName
}

module.exports = {factory, MIDDLEWARE_NAME}
