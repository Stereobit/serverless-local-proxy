const MIDDLEWARE_NAME = 'http_request_logger'
const LOG_PREFIX = 'HttpRequestLogger::'
const chalk = require('chalk')
const { middlewareFormattedOutput } = require('@serverless-local-proxy/utils_middleware')

/**
 * Factory
 *
 */
const factory = (config) => {
  const { name: middlewareName } = config.middlewareConfig
  return {
    middlewareName,
    factoryType: 'SERVER',
    resolver: async (ctx, next) => {
      const request = ctx.request
      const title = 'New http request'
      const method = chalk.cyan(`METHOD: ${chalk.magenta(request.method)}`)
      const url = chalk.cyan(`URL: ${chalk.magenta(request.url)}`)
      const accept = chalk.cyan(`ACCEPT: ${chalk.magenta(request.header.accept)}`)
      middlewareFormattedOutput(ctx, LOG_PREFIX, title, formatLogMessage(method, url, accept))
      await next()
    }
  }
}

/**
 * FormatLogMessage
 *
 * @param method
 * @param url
 * @param accept
 * @return {string}
 */
const formatLogMessage = (method, url, accept) => `${method} - ${url} \n${accept}`

module.exports = { factory, MIDDLEWARE_NAME }
