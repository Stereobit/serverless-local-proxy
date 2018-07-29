const MIDDLEWARE_NAME = 'ddb_trigger'
const {updateMiddlewareOutputState} = require('@serverless-local-proxy/utils_middleware')

/**
 * Factory
 *
 * @param config
 * @return {Function}
 */
const factory = (config) => {
  return async (ctx, next) => {
    const tableName = validateTrigger(ctx)
    if (tableName) {
      // Extract function
      const triggerFunction = getTriggerFunction(config.proxyConfig.configTables, tableName)

      // Find the function settings from the service functions
      const functionDetails = config.serviceFunctions.find(sf => sf.name === triggerFunction)
      if (functionDetails) {
        const triggerResult = {
          invokeFunctionName: functionDetails.name,
          invokeFunctionPath: functionDetails.path,
          // TODO: @diego[refactor] body.Item assumes that the query is PutItem...maybe needs a mw that process the query, something like mw_ddb_query_to_payload
          invokeFunctionPayload: ctx.request.body.Item ? ctx.request.body.Item : ctx.request.body
        }
        updateMiddlewareOutputState(ctx, triggerResult)
      }
    }
    await next()
  }
}

/**
 * GetTriggerFunction
 *
 * @param tableSettings
 * @param tableName
 * @return {*}
 */
const getTriggerFunction = (tableSettings, tableName) => {
  if (tableSettings instanceof Array) {
    const tableConfig = tableSettings.find(o => o[tableName])
    if (tableConfig && tableConfig[tableName].trigger_function) {
      return tableConfig[tableName].trigger_function
    }
  }
  return null
}

/**
 * ValidateTrigger
 *
 * @param ctx
 * @return {*}
 */
const validateTrigger = (ctx) => {
  if (ctx.request.header['x-amz-target']) {
    const action = ctx.request.header['x-amz-target']
    const splitAction = action.split('.')
    if (splitAction.length !== 2 || splitAction[1] !== 'PutItem') {
      return null
    }
    if (!ctx.request.body || !ctx.request.body.TableName) {
      return null
    }
    return ctx.request.body.TableName
  }
}
module.exports = {factory, MIDDLEWARE_NAME}
