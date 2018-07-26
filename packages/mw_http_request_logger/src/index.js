const MIDDLEWARE_NAME = 'http_request_logger'
const LOG_PREFIX = 'HttpRequestLogger::'
const chalk = require('chalk')
const {middlewareFormattedOutput} = require('@serverless-local-proxy/utils_middleware')
const prettyJson = require('prettyjson')
/**
 * Factory
 *
 */
const factory = (config) => {
  const {name: middlewareName} = config.middlewareConfig
  return {
    middlewareName,
    factoryType: 'SERVER',
    resolver: async (ctx, next) => {
      const request = ctx.request
      const title = 'New http request'
      const method = chalk.cyan(`METHOD: ${chalk.magenta(request.method)}`)
      const url = chalk.cyan(`URL: ${chalk.magenta(request.url)}`)
      const accept = chalk.cyan(`ACCEPT: ${chalk.magenta(request.header.accept)}`)
      const body = chalk.cyan(`BODY REQUEST: \n${prettyBody(ctx.request.body)}`)
      middlewareFormattedOutput(ctx, LOG_PREFIX, title, formatLogMessage(method, url, accept, body))
      await next()
    }
  }
}

/**
 * FormatLogMessage
 *
 * @param {string} method
 * @param {string} url
 * @param {string} accept
 * @param {string} body
 * @return {string}
 */
const formatLogMessage = (method, url, accept, body) => `${method} - ${url} \n${accept}\n${body}`

/**
 * PrettyBody
 *
 * @param { JSON } body
 * @return {*}
 */
const prettyBody = (body) => prettyJson.render(body, {
  keysColor: 'cyan',
  dashColor: 'magenta',
  stringColor: 'magenta'
})

module.exports = {factory, MIDDLEWARE_NAME}
