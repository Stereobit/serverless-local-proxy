const MIDDLEWARE_NAME = 'ddb_query_logger'
const LOG_PREFIX = 'QueryLogger'
const prettyJson = require('prettyjson')
const {middlewareFormattedOutput} = require('@serverless-local-proxy/utils_middleware')

/**
 * Factory
 *
 * @param config
 * @return {function(*, *): *}
 */
const factory = (config) => {
  const {proxyLogPrefix} = config
  return async (ctx, next) => {
    if (ctx.request.header['x-amz-target']) {
      const target = ctx.request.header['x-amz-target'].split('.')
      const method = ctx.request.method
      const log = prettyJson.render(ctx.request.body, {
        keysColor: 'cyan',
        dashColor: 'magenta',
        stringColor: 'magenta'
      })
      middlewareFormattedOutput(proxyLogPrefix, LOG_PREFIX, `NEW QUERY - method: ${method} target: ${target[1]}`, log)
    }
    return await next()
  }
}

module.exports = {factory, MIDDLEWARE_NAME}
