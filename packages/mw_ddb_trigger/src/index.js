const MIDDLEWARE_NAME = 'ddb_trigger'
const {factory: invokeHttpFunctionFactory} = require('@serverless-local-proxy/mw_invoke_http_function')
const {updateMiddlewareOutputState} = require('@serverless-local-proxy/utils_middleware')

/**
 * Factory
 *
 * @param config
 * @return {{middlewareName: *, factoryType: string, resolver: resolver}}
 */
const factory = (config) => {
  const {name: middlewareName} = config.middlewareConfig
  return {
    middlewareName,
    factoryType: 'SERVER',
    resolver: async (ctx, next) => {
      const tableName = validateTrigger(ctx)
      if (tableName) {
        const triggerFunction = getTriggerFunction(config.proxyConfig.configTables, tableName)
        if (triggerFunction) {
          const invokeHttpFunction = invokeHttpFunctionFactory(config).resolver
          updateMiddlewareOutputState(ctx, {functionName: triggerFunction, payload: ctx.request.body})
          await invokeHttpFunction(ctx, () => {})
        }
      }
      await next()
    }
  }
}

/**
 * GetTableSettings
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
